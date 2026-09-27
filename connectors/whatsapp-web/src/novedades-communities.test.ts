import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CommunityService } from './novedades-communities';

const communityId = '123@g.us';
const groupId = '456@g.us';
function fixture(admin = true) {
  const calls: unknown[] = [];
  const community = {
    id: communityId,
    subject: 'Community',
    desc: '',
    isCommunity: true,
    participants: [{ id: '1@s.whatsapp.net', admin: admin ? 'admin' : null }],
  };
  const group = { id: groupId, subject: 'Group', participants: community.participants };
  const socket: any = {
    user: { id: '1:2@s.whatsapp.net' },
    communityMetadata: async () => community,
    groupMetadata: async () => group,
    communityFetchAllParticipating: async () => ({ [communityId]: community, [groupId]: group }),
    communityFetchLinkedGroups: async () => ({
      communityJid: communityId,
      isCommunity: true,
      linkedGroups: [],
    }),
    communityCreate: async (...args: unknown[]) => {
      calls.push(args);
      return community;
    },
    communityUpdateSubject: async (...args: unknown[]) => {
      calls.push(args);
    },
    communityUpdateDescription: async (...args: unknown[]) => {
      calls.push(args);
    },
    communityLinkGroup: async (...args: unknown[]) => {
      calls.push(args);
    },
    communityUnlinkGroup: async (...args: unknown[]) => {
      calls.push(args);
    },
    communityLeave: async (...args: unknown[]) => {
      calls.push(args);
      community.participants = [];
    },
  };
  return { service: new CommunityService(socket), socket, community, group, calls };
}

test('listing includes only explicit communities and exposes safe metadata', async () => {
  const { service } = fixture();
  const result = await service.list();
  assert.equal(result.length, 1);
  assert.equal(result[0].id, communityId);
  assert.equal(result[0].capabilities.manageGroups, true);
  assert.equal('participants' in result[0], false);
});

test('ordinary group without linkedParent is not accepted as community', async () => {
  const { service, socket, group } = fixture();
  socket.communityMetadata = async () => group;
  await assert.rejects(service.detail(groupId), { code: 'NOT_A_COMMUNITY', status: 400 });
});

test('invalid JIDs and action payloads fail before mutations', async () => {
  const { service, calls } = fixture();
  await assert.rejects(service.detail('personal:123@g.us'), { status: 400 });
  await assert.rejects(service.action(communityId, { action: 'subject', subject: '' }), {
    status: 400,
  });
  await assert.rejects(service.action(communityId, { action: 'other' }), { status: 400 });
  assert.equal(calls.length, 0);
});

test('create supports omitted description but rejects null provider result', async () => {
  const { service, socket, calls } = fixture();
  await service.create({ subject: 'New' });
  assert.deepEqual(calls[0], ['New', '']);
  socket.communityCreate = async () => null;
  await assert.rejects(service.create({ subject: 'New', description: '' }), { status: 502 });
});

test('non-admin cannot edit or link but member may leave', async () => {
  const { service, calls } = fixture(false);
  await assert.rejects(service.action(communityId, { action: 'subject', subject: 'New' }), {
    status: 403,
  });
  await assert.rejects(service.action(communityId, { action: 'link', groupJid: groupId }), {
    status: 403,
  });
  await service.action(communityId, { action: 'leave' });
  assert.deepEqual(calls, [[communityId]]);
});

test('link rejects foreign parent, announcements and non-admin group', async () => {
  const { service, group, calls } = fixture();
  Object.assign(group, { linkedParent: '789@g.us' });
  await assert.rejects(service.action(communityId, { action: 'link', groupJid: groupId }), {
    status: 409,
  });
  Object.assign(group, { linkedParent: undefined, isCommunityAnnounce: true });
  await assert.rejects(service.action(communityId, { action: 'link', groupJid: groupId }), {
    status: 400,
  });
  Object.assign(group, {
    isCommunityAnnounce: false,
    participants: [{ id: '1@s.whatsapp.net', admin: null }],
  });
  await assert.rejects(service.action(communityId, { action: 'link', groupJid: groupId }), {
    status: 403,
  });
  assert.equal(calls.length, 0);
});

test('unlink requires matching parent and forwards provider failures', async () => {
  const { service, socket, group } = fixture();
  await assert.rejects(service.action(communityId, { action: 'unlink', groupJid: groupId }), {
    status: 409,
  });
  Object.assign(group, { linkedParent: communityId });
  socket.communityUnlinkGroup = async () => {
    throw new Error('provider failed');
  };
  await assert.rejects(
    service.action(communityId, { action: 'unlink', groupJid: groupId }),
    /provider failed/
  );
});

test('detail rejects partial linked-group response instead of showing empty list', async () => {
  const { service, socket } = fixture();
  socket.communityFetchLinkedGroups = async () => ({ communityJid: communityId });
  await assert.rejects(service.detail(communityId), { status: 502 });
});

test('detail projects linked groups without provider owner or participant data', async () => {
  const { service, socket } = fixture();
  socket.communityFetchLinkedGroups = async () => ({
    communityJid: communityId,
    linkedGroups: [{ id: groupId, subject: 'Group', owner: 'private', size: 12, creation: 100 }],
  });
  const detail = await service.detail(communityId);
  assert.deepEqual(detail.linkedGroups, [
    { id: groupId, name: 'Group', participantCount: 12, createdAt: 100 },
  ]);
});

test('failed post-write metadata refresh reports uncertain result and does not repeat write', async () => {
  const { service, socket, calls } = fixture();
  socket.communityUpdateDescription = async (...args: unknown[]) => {
    calls.push(args);
    socket.communityMetadata = async () => {
      throw new Error('network');
    };
  };
  await assert.rejects(service.action(communityId, { action: 'description', description: '' }), {
    code: 'COMMUNITY_CHANGE_UNCONFIRMED',
    status: 502,
  });
  assert.deepEqual(calls, [[communityId, '']]);
});

test('instance account identity resolves PN and LID without shared state', async () => {
  const a = fixture();
  const b = fixture();
  b.socket.user = { id: '2@s.whatsapp.net', lid: '99@lid' };
  b.community.participants = [{ id: '99@lid', admin: 'admin' }];
  assert.equal((await b.service.list())[0].capabilities.editInfo, true);
  a.socket.user = { id: '2@s.whatsapp.net' };
  assert.equal((await a.service.list())[0].capabilities.editInfo, false);
  await assert.rejects(a.service.action(communityId, { action: 'leave' }), { status: 403 });
});

test('provider acknowledgement without applied link is not success', async () => {
  const { service } = fixture();
  await assert.rejects(service.action(communityId, { action: 'link', groupJid: groupId }), {
    code: 'COMMUNITY_CHANGE_UNCONFIRMED',
    status: 502,
  });
});

test('leave acknowledgement with unchanged membership is not success', async () => {
  const { service, socket } = fixture();
  socket.communityLeave = async () => {};
  await assert.rejects(service.action(communityId, { action: 'leave' }), {
    code: 'COMMUNITY_CHANGE_UNCONFIRMED',
    status: 502,
  });
});

test('confirmed link and subject changes call the verified provider signatures', async () => {
  const { service, socket, group, community, calls } = fixture();
  socket.communityLinkGroup = async (...args: unknown[]) => {
    calls.push(args);
    Object.assign(group, { linkedParent: communityId });
  };
  socket.communityUpdateSubject = async (jid: string, subject: string) => {
    calls.push([jid, subject]);
    community.subject = subject;
  };
  assert.deepEqual(await service.action(communityId, { action: 'link', groupJid: groupId }), {
    action: 'link',
    communityId,
  });
  await service.action(communityId, { action: 'subject', subject: 'Updated' });
  assert.deepEqual(calls, [
    [groupId, communityId],
    [communityId, 'Updated'],
  ]);
});
