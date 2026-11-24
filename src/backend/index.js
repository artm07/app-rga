// Escolhe onde ficam as contas: no servidor (se EXPO_PUBLIC_API_URL estiver definida)
// ou no próprio aparelho (modo demonstração).
import * as local from './local';
import * as remote from './remote';

const backend = remote.API_URL ? remote : local;
export default backend;
