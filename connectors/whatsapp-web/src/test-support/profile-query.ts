/** Load the installed patch and build one timestamped profile-picture token. */
export async function profilePictureQueryFixture() {
  const moduleRoot = '@whiskeysockets/baileys/lib';
  const chats = await import(`${moduleRoot}/Socket/chats.js`);
  const tokens = await import(`${moduleRoot}/Utils/tc-token-utils.js`);
  const timestamp = String(Math.floor(Date.now() / 1000));
  const jid = '34600@s.whatsapp.net';
  const token = Buffer.from([4, 1, 33]);
  const tcTokenContent = await tokens.buildTcTokenFromJid({
    jid,
    getLIDForPN: async () => null,
    authState: { keys: { get: async () => ({ [jid]: { token, timestamp } }) } },
  });
  return {
    buildProfilePictureQueryContent: chats.buildProfilePictureQueryContent,
    buildTcTokenFromJid: tokens.buildTcTokenFromJid,
    timestamp,
    jid,
    token,
    tcTokenContent,
  };
}
