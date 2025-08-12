const compareTransactionASC = (
  a: { createdAt: string | number | Date },
  b: { createdAt: string | number | Date }
) => {
  if (new Date(a.createdAt) < new Date(b.createdAt)) {
    return -1;
  }
  if (new Date(a.createdAt) > new Date(b.createdAt)) {
    return 1;
  }
  return 0;
};
const compareTransactionDESC = (
  a: { createdAt: string | number | Date },
  b: { createdAt: string | number | Date }
) => {
  if (new Date(a.createdAt) > new Date(b.createdAt)) {
    return -1;
  }
  if (new Date(a.createdAt) < new Date(b.createdAt)) {
    return 1;
  }
  return 0;
};

export { compareTransactionASC, compareTransactionDESC };
