const getBorderColor = (connectionStatus) => {
  switch (connectionStatus) {
    case 'Conectando':
      return 'border-yellow-300';
    case 'Conectado':
      return 'border-blue-400';
    case 'Desconectado':
      return 'border-gray-300';
    case 'Error al conectar':
      return 'border-red-500';
    default:
      return 'border-gray-100';
  }
};

const ConnectionStatusIndicator = ({ connectionStatus }) => {
  const borderClass = getBorderColor(connectionStatus);

  return borderClass;
};

export default ConnectionStatusIndicator;
