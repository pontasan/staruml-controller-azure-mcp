#!/usr/bin/env node
import { apiGet, apiPost, apiDelete, encId, runTest } from './test-utils.mjs';

const DIR = import.meta.dirname;

await runTest('azure', DIR, async (ctx) => {
  let s = ctx.step('Create Azure diagram');
  let diagramId;
  try {
    const res = await apiPost('/api/azure/diagrams', { name: 'Test Azure' });
    diagramId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create group');
  let groupId;
  try {
    const res = await apiPost('/api/azure/elements', { diagramId, type: 'AzureGroup', name: 'Resource Group', x1: 50, y1: 50, x2: 500, y2: 300 });
    groupId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create service (App Service)');
  let appId;
  try {
    const res = await apiPost('/api/azure/elements', { diagramId, type: 'AzureService', name: 'App Service', x1: 100, y1: 120, x2: 220, y2: 200 });
    appId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create service (SQL Database)');
  let sqlId;
  try {
    const res = await apiPost('/api/azure/elements', { diagramId, type: 'AzureService', name: 'SQL Database', x1: 330, y1: 120, x2: 450, y2: 200 });
    sqlId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create connector: App → SQL');
  try {
    await apiPost('/api/azure/connectors', { diagramId, sourceId: appId, targetId: sqlId });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  await ctx.layoutDiagram(diagramId);
  await ctx.exportDiagram(diagramId, 'Export Azure image');

  s = ctx.step('Delete diagram');
  try {
    await apiDelete(`/api/azure/diagrams/${encId(diagramId)}`);
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }
});
