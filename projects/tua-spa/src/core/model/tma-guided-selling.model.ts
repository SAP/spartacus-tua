/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
export interface TmaGuidedSellingStep {
  id: string;
  name: string;
  active: boolean;
  inProductGroup: boolean;
}

export enum TmaSelectionAction {
  ADD = 'add',
  REMOVE = 'remove'
}
