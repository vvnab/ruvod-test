import { createHashHistory } from 'history';
export const history = createHashHistory({ basename: process.env.PUBLIC_URL || "" });