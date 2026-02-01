import React, { useState, useEffect } from 'react';
import './PODs.css';

const PODs = () => {
  const [pods, setPods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPod, setSelectedPod] = useState(null);

  useEffect(() => {
    fetchPods();
  }, []);

  const fetchPods = async () => {
    try {
      setLoading(true);
      // Mock data - replace with API call to GET /api/pods?status=pending
      const mockPods = [
        {
          id: 'POD-8001',
          loadId: 'BK-1003',
          driver: 'Sarah Smith',
          fromLocation: 'Chennai',
          toLocation: 'Hyderabad',
          uploadDate: '2026-01-10 02:30 PM',
          status: 'pending',
          images: [
            'https://via.placeholder.com/300x200?text=POD+Image+1',
            'https://via.placeholder.com/300x200?text=POD+Image+2',
          ],
        },
        {
          id: 'POD-8002',
          loadId: 'BK-1005',
          driver: 'John Doe',
          fromLocation: 'Mumbai',
          toLocation: 'Pune',
          uploadDate: '2026-01-10 11:15 AM',
          status: 'pending',
          images: [
            'https://via.placeholder.com/300x200?text=Delivery+Proof',
          ],
        },
      ];
      setPods(mockPods);
    } catch (err) {
      console.error('Failed to fetch PODs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePod = async (podId) => {
    if (!window.confirm('Approve this POD? This will auto-create an invoice.')) return;
    
    try {
      // API call: PUT /api/pods/:id/approve
      console.log('Approving POD:', podId);
      alert('POD approved! Invoice will be created automatically.');
      fetchPods(); // Refresh list
    } catch (err) {
      console.error('Failed to approve POD:', err);
      alert('Failed to approve POD');
    }
  };

  const handleRejectPod = async (podId) => {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;

    try {
      // API call: PUT /api/pods/:id/reject
      console.log('Rejecting POD:', podId, 'Reason:', reason);
      alert('POD rejected. Driver will be notified.');
      fetchPods(); // Refresh list
    } catch (err) {
      console.error('Failed to reject POD:', err);
      alert('Failed to reject POD');
    }
  };

  if (loading) {
    return <div className="pods-loading">Loading PODs...</div>;
  }

  return (
    <div className="pods-page">
      <div className="pods-grid">
        {pods.map((pod) => (
          <div key={pod.id} className="pod-card">
            <div className="pod-header">
              <div className="pod-id">{pod.id}</div>
              <div className="pod-status-badge">Pending Review</div>
            </div>

            <div className="pod-images">
              {pod.images.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  alt={`POD ${idx + 1}`} 
                  className="pod-image"
                  onClick={() => setSelectedPod({ ...pod, selectedImage: img })}
                />
              ))}
            </div>

            <div className="pod-details">
              <div className="detail-row">
                <span className="detail-label">Load ID:</span>
                <span className="detail-value">{pod.loadId}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Driver:</span>
                <span className="detail-value">{pod.driver}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Route:</span>
                <span className="detail-value">
                  {pod.fromLocation} → {pod.toLocation}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Upload Date:</span>
                <span className="detail-value">{pod.uploadDate}</span>
              </div>
            </div>

            <div className="pod-actions">
              <button 
                className="approve-btn"
                onClick={() => handleApprovePod(pod.id)}
              >
                ✓ Approve POD
              </button>
              <button 
                className="reject-btn"
                onClick={() => handleRejectPod(pod.id)}
              >
                ✗ Reject POD
              </button>
            </div>
          </div>
        ))}
      </div>

      {pods.length === 0 && (
        <div className="no-data">No pending PODs to review</div>
      )}

      {/* Image Modal */}
      {selectedPod && (
        <div className="image-modal" onClick={() => setSelectedPod(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPod(null)}>✕</button>
            <img src={selectedPod.selectedImage} alt="POD Full View" className="modal-image" />
            <div className="modal-info">
              <h3>{selectedPod.id}</h3>
              <p>Load: {selectedPod.loadId} | Driver: {selectedPod.driver}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PODs;
