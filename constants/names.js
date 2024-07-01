const names = [
  { id: '1', name: 'Angel' },
  { id: '2', name: 'Brenda' },
  { id: '3', name: 'Clara' },
  { id: '4', name: 'Dulce' },
  { id: '5', name: 'Isela' },
  { id: '6', name: 'Jonathan' },
  { id: '7', name: 'Luz' },
  { id: '8', name: 'Madday' },
  { id: '9', name: 'Mauricio' },
  { id: '10', name: 'Rodolfo' },
].sort((a, b) => a.name.localeCompare(b.name));

export default names;
