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


/// <reference path="../../../../../../../externs/ts/angularjs/angular.d.ts" />


// TODO(bryantd): change the namespace from 'app' to 'datalab' to avoid colliding with
// the ever present app module (app.App) (or change the app module name...)
declare module app {

  interface CellScope extends ng.IScope {
    cell: any;
    worksheetId: string;
    // TODO(bryantd): see if possible to remove the optional flags from the following
    // Issue is that when the scope is first created (by directive), these fields will not exist.
    // These fields are created/populated within the controller.
    keymap?: any;
    ctrl?: ICellController;
  }

  interface ICellController {
    showEditRegion: boolean;
    showPreviewRegion: boolean;
    switchToEditMode (): void;
  }

  interface ILogger {
    debug (...objects: Object []): void;
    info (...objects: Object []): void;
    warn (...objects: Object []): void;
    error (...objects: Object []): void;
  }

  interface INotebookData {
    activeCell: app.notebooks.Cell;
    activeWorksheet: app.notebooks.Worksheet;
    notebook: app.notebooks.Notebook;

    addCell (cellType: string, worksheetId: string, insertAfterCellId: string): void;
    clearOutput (cellId: string, worksheetId: string): void;
    clearOutputs (): void;
    deleteCell (cellId: string, worksheetId: string): void;
    deselectCell (): void;
    evaluateCell (cell: app.notebooks.Cell, worksheetId: string): void;
    executeCell (cellId: string, worksheetId: string): void;
    executeCells (): void;
    moveCell (cellId: string, worksheetId: string, insertAfterCellId: string): void;
    moveCellDown (cellId: string, worksheetId: string): void;
    moveCellUp (cellId: string, worksheetId: string): void;
    selectCell (cell: app.notebooks.Cell): void;
    selectWorksheet (workhsheetId: string): void;
    updateCell (cell: app.notebooks.Cell, worksheetId: string): void;
  }

  interface IRegistrar {
    controller (name: string, constructor: Function): void;
    directive (name: string, directiveFactory: Function): void;
    service (name: string, constructor: Function): void;
    factory (name: string, serviceFactory: Function): void;
    constant (name: string, value: any): void;
    value (name: string, value: any): void;
    decorator (name: string, decorator: Function): void;
    filter (name: string, filterFactory: Function): void;
  }

  interface ISession {

  }

  interface ISessionConnection {
    on (messageType: string, callback: SessionMessageHandler): void;
    emit (messageType: string, message: any): void;
  }

  interface SessionMessageHandler {
    (message: any): void;
  }

  // UI-specific extensions to the datalab notebook types
  module notebooks {
    interface AugmentedCellOutput extends notebooks.CellOutput {
      preferredMimetype?: string;
      trustedHtml?: string;
    }
  }

}
