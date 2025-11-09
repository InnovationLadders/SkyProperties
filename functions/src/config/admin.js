import admin from 'firebase-admin';

let adminInitialized = false;

export const initializeAdmin = () => {
  if (adminInitialized) {
    return admin;
  }

  const serviceAccount = {
    type: "service_account",
    project_id: "skyproperties-cf5c7",
    private_key_id: "49a7f8ccbd08a0569738413203f871147c14416c",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQCVGFfG9CuS39FH\nnp7J2o1tn75sol87DKf43L3kOsR543yPKqCp5apItfEf9I2d0ZtbwBXg5so0K553\nquv3G1VWxRZzsVLfnKgZNG8YBYLCc3O2UnnpCcJF2fVm26rabRIZdOaJv3aFRIbh\nwZKGYcVD9YtRaMTZunNSb4JLSWXfoX/oVhJm1GYyofuGIqAu+ba735dVd4PP3/AY\n3jRu7IiFhULNK2VMQLjF3HlRMzcVorSOHn9obMRY/+5puca3RuFKmsi0ID4qFNv3\n0kr9mKvUHiEg4HYnLnBu4e8yA5tp/FoDs1Shzy0rAHUvOE/bdlszlAzkbdEIpb9R\nDDtxGyolAgMBAAECgf8mmTPMrp4RarZn+2dZ2pt5eigohLG/gEX8KhnvYfkYUTeS\nlPFb8ImQObPcw5+IClsb0MsnlX4CXG0VL+lupJfT8Szr5gQolrGqMtaaaUXB3VYF\nQ1odS5XjNmglUFX9VaffHk0DqqpfxlYK59DlPUDCVKgNseq8nR1ie2G1ef9BJufY\nqkpcuv7vtHWcbxwkJdTN43gDF2MI9x0z1UrQ7U3yQORG6jxDz6I3aO740uJVapjA\nSNH1avo93rCqJLwjuGLMP+gTf8BwySojTv8f7WVN4hdcfEJva2lIIpxKqksMe0tV\n3gHbG3Zbzm0Rm7YY9fo8IZhiKXbhvdaypOVtQjECgYEAxhrjK7WWCXTPmWdG+jjW\nA14nfa5CX3ABJZdbA+AZqwoEchf+aLhAdrJmrsEtO+siXSH+cOK9cNce1Ra8vZz2\n3WEds2TD0Yv7PpsUH1o/pkYJIuX45SJWMkSih3eohmQYS9XV9lKKYIullgnclDYy\n+C2p5N60tYv8/2qEiDRS5A0CgYEAwKrOK4XssOD0DVce3T732/247/s0d+Erql2I\nh/SS8PhNsG1mITWUkwHAktAuvYEUBbz9pev+PrXnv2dWssthQm7bhSwiUkkEFQFd\nSAm58WL9CdHiDgjNzLMxWx8tqe8SimmLt5b+wGrXWRrmLg+H6mf+IDNvrIXBwRSi\nGYVq4HkCgYAzdciNEh5nVnCW6L0HQrxVI6AehaW4JOAnY6nA1/XS+EcvXAw6J6KX\nMsB5pLSbW/kROENgD4YmSbs4ny9oEd4Oo6uTbhlv1WzuVlpjyo2+I3M8HYEKBGFf\nrXSKvAqK3nVxPZrW4ZoQejYJQ4aI+YtD7Ji1WySWBEc0EfdbajweAQKBgFIM67xx\nTnmNc6Hyxjwmwtu3U/kvnAqppDTrnGd56tIgjMVj8aiW7u0kQ+TCMAWYYPSIpeTx\nedcvFMDYu31tS8BFAcvXHc65NbnUWOuC6OM56tUxwvmDGlHgxlYuEv5ZyCWWCWBo\nN5muZoOWBwz6pEFZhEomXZq1Y+xcYyRHQ1rRAoGAZ1PmEEbL5TU79QeMvl1m2TKq\nGXzvlU6JiICguwPjuEx4siBJua/hIVgrGjel6qKMq1mTUKMbm2Hx1AbhlMVJ+cVO\nySl7oPIRvxFWA/Y0KDRY819wTW6sM2aESIzcFqcOW4mghAldxmRbUXgAJyl1XdeX\nrQAopdtFDq5op7bYAM0=\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-fbsvc@skyproperties-cf5c7.iam.gserviceaccount.com",
    client_id: "117468342801966971925",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40skyproperties-cf5c7.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "skyproperties-cf5c7.firebasestorage.app"
  });

  adminInitialized = true;
  return admin;
};

export const getAdmin = () => {
  if (!adminInitialized) {
    return initializeAdmin();
  }
  return admin;
};

export default admin;
