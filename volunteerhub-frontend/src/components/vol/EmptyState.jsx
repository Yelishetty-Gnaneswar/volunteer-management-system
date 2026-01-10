const EmptyState = () => {
  return (
    <div className="text-center mt-16 text-gray-500">
      <div className="text-5xl mb-4">📅</div>
      <p className="text-lg font-medium">No events found</p>
      <p className="text-sm">Try switching tabs or come back later.</p>
    </div>
  );
};

export default EmptyState;