/*
 * Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */


/**
 * Interfaces definitions
 */
declare module app {

  interface Settings {
    httpPort: number;
  }

  interface CellRef {
    cellId: string;
    worksheetId: string;
  }

  interface EventHandler<T> {
    (event: T): void;
  }

  interface KernelConfig {
    iopubPort: number;
    shellPort: number;
  }

  /**
   * Manages a single notebook's data and provides an API for applying changes captured by Actions.
   */
  interface INotebookSession {
    /**
     * Applies the Action to the notebook model and returns a corresponding Update message.
     *
     * The Update captures the delta necessary for any other copies of the notebook model (e.g.,
     * that exist on clients) to be synchronized with the notebook model held by this instance
     * (assuming that they were synchronized before the update arrived).
     */
    apply (action: notebooks.actions.Action): notebooks.updates.Update;

    /**
     * Gets a reference to the notebook data held within the instance.
     *
     * Callers should consider the returned reference to be read-only.
     */
    getNotebookData (): notebooks.Notebook;

    /**
     * Gets a reference to the specified cell within the notebook.
     *
     * Throws an error if the cell does not exist within the specified worksheet.
     */
    getCell (cellId: string, worksheetId: string): notebooks.Cell;
  }

  interface IKernel {
    id: string;
    config: KernelConfig;
    execute (request: ExecuteRequest): void;
    onExecuteReply (callback: EventHandler<ExecuteReply>): void;
    onKernelStatus (callback: EventHandler<KernelStatus>): void;
    onOutputData (callback: EventHandler<OutputData>): void;
    shutdown (): void;
    start (): void;
  }

  interface IKernelManager {
    create (config: KernelConfig): IKernel;
    get (id: string): IKernel;
    list (): IKernel[];
    shutdown (id: string): void;
    shutdownAll (): void;
  }

  /**
   * Synchronous serialization of notebooks to/from data strings.
   *
   * These methods throw exceptions for ill-formed inputs or unsupported notebook formats,
   * which is consistent with the behavior of JSON.parse/stringify, which this interface mirrors
   * (also see https://www.joyent.com/developers/node/design/errors).
   *
   * Because notebooks can grow to be quite large, especially when data and media have been
   * embedded, it may be worthwhile to move to an async approach eventually. Some relevant
   * discussion around async JSON serialization in NodeJS here:
   * https://github.com/joyent/node/issues/7543
   */
  interface INotebookSerializer {
    /**
     * Deserializes the notebook from a string.
     *
     * Throws an exception if the given notebook data string violates the expected format.
     * specification.
     */
    parse (data: string): notebooks.Notebook;

    /**
     * Serializes the notebook to the specified format.
     *
     * Throws an exception if unsupported cell or media types are included in the notebook.
     */
    stringify (notebook: notebooks.Notebook): string;
  }

  interface ISession {
    id: string;
    getKernelId (): string;
    getUserConnectionIds (): string[];
    updateUserConnection (connection: IUserConnection): void;
  }

  interface ISessionManager {
    renameSession (oldId: string, newId: string): void;
  }

  interface IStorage {
    read (path: string): string;
    write (path: string, data: string): void;
    delete (path: string): boolean;
    // move (sourcePath: string, destinationPath: string);
    // copy (sourcePath: string, destinationPath: string);
  }

  interface IUserConnection {
    id: string;
    getNotebookPath (): string;
    onDisconnect (callback: EventHandler<IUserConnection>): void;
    onAction (callback: EventHandler<notebooks.actions.Action>): void;
    sendUpdate (update: notebooks.updates.Update): void;
  }

  interface IUserConnectionManager {
    onConnect (callback: EventHandler<IUserConnection>): void;
    onDisconnect (callback: EventHandler<IUserConnection>): void;
  }

}

