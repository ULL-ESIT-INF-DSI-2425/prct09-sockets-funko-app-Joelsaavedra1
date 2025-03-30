import { Funko } from '../funko/funko.js';

/**
 * This type represents a request to the Funko Manager.
 * It includes the type of request and an optional list of Funkos.
 */
export type RequestType = {
  type: 'add' | 'update' | 'remove' | 'show' | 'list';
  user: string;
  id?: string;
  funko?: Funko
}

/**
 * This type represents a response from the Funko Manager.
 * It includes the type of request, success status, and optional list of Funkos.
 */
export type ResponseType = {
  type: 'add' | 'update' | 'remove' | 'show' | 'list' | 'error';
  success: boolean;
  message: string;
}