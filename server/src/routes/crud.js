import { Router } from 'express';
import { HttpError } from '../middleware/error.js';

const PROTECTED_FIELDS = ['_id', '__v', 'createdAt', 'updatedAt'];

export function pickBody(body = {}) {
  const data = { ...body };
  for (const field of PROTECTED_FIELDS) delete data[field];
  return data;
}

async function findOr404(Model, id) {
  const doc = await Model.findById(id);
  if (!doc) throw new HttpError(404, `${Model.modelName} not found.`);
  return doc;
}

/** Standard admin CRUD endpoints for a content model. */
export function crudRouter(Model, { sort = { order: 1, createdAt: -1 } } = {}) {
  const router = Router();

  router.get('/', async (req, res) => {
    res.json(await Model.find().sort(sort));
  });

  router.get('/:id', async (req, res) => {
    res.json(await findOr404(Model, req.params.id));
  });

  router.post('/', async (req, res) => {
    res.status(201).json(await Model.create(pickBody(req.body)));
  });

  // Save via the document (not findByIdAndUpdate) so validators and hooks such as slug generation run.
  const update = async (req, res) => {
    const doc = await findOr404(Model, req.params.id);
    doc.set(pickBody(req.body));
    await doc.save();
    res.json(doc);
  };
  router.put('/:id', update);
  router.patch('/:id', update);

  router.delete('/:id', async (req, res) => {
    const doc = await findOr404(Model, req.params.id);
    await doc.deleteOne();
    res.json({ message: 'Deleted', id: doc.id });
  });

  /** Body: { ids: [...] } in the new display order. */
  router.post('/reorder', async (req, res) => {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(String) : [];
    if (!ids.length) throw new HttpError(400, 'ids must be a non-empty array.');
    await Model.bulkWrite(ids.map((id, index) => ({ updateOne: { filter: { _id: id }, update: { order: index } } })));
    res.json({ message: 'Order saved' });
  });

  return router;
}
