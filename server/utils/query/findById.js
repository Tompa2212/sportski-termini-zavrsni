const capitalize = (str) => str[0].toUpperCase() + str.slice(1).toLowerCase();

export const findById = async (tx, label, id) => {
  if (!tx || !label || !id) {
    return;
  }

  const nodeLabel = capitalize(label);

  const resp = await tx.run(
    `
    MATCH (node:${nodeLabel} {id: $id})
    RETURN node;
  `,
    { id }
  );

  if (!resp || resp.records.length === 0) {
    return null;
  }

  return resp.records[0].get('node').properties;
};
