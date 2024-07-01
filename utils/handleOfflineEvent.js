const handleOfflineEvent = (event) => {
  const offlineEvents = JSON.parse(localStorage.getItem('offlineEvents')) || [];
  offlineEvents.push(event);
  localStorage.setItem('offlineEvents', JSON.stringify(offlineEvents));
};

export default handleOfflineEvent;
