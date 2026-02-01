import React, { useState, useEffect } from 'react';
import './Ratings.css';

const Ratings = () => {
  const [ratings, setRatings] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      // Mock data - replace with GET /api/ratings
      const mockRatings = [
        {
          id: 'RAT-4001',
          tripId: 'TR-5003',
          user: 'ABC Corporation',
          driver: 'Mike Johnson',
          rating: 5,
          comment: 'Excellent service! Driver was professional and on time.',
          date: '2026-01-10',
        },
        {
          id: 'RAT-4002',
          tripId: 'TR-5001',
          user: 'XYZ Industries',
          driver: 'John Doe',
          rating: 4,
          comment: 'Good service, slightly delayed but overall satisfied.',
          date: '2026-01-09',
        },
        {
          id: 'RAT-4003',
          tripId: 'TR-4998',
          user: 'Tech Solutions',
          driver: 'Sarah Smith',
          rating: 5,
          comment: 'Perfect delivery! Highly recommend.',
          date: '2026-01-08',
        },
      ];
      
      setRatings(mockRatings);

      // Calculate stats
      const totalReviews = mockRatings.length;
      const totalStars = mockRatings.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalReviews > 0 ? (totalStars / totalReviews).toFixed(1) : 0;
      
      const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      mockRatings.forEach(r => breakdown[r.rating]++);

      setStats({ averageRating, totalReviews, breakdown });
    } catch (err) {
      console.error('Failed to fetch ratings:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getPercentage = (count) => {
    return stats.totalReviews > 0 ? ((count / stats.totalReviews) * 100).toFixed(0) : 0;
  };

  if (loading) {
    return <div className="ratings-loading">Loading ratings...</div>;
  }

  return (
    <div className="ratings-page">
      {/* Stats Section */}
      <div className="ratings-stats">
        <div className="stats-card">
          <div className="average-rating">
            <div className="rating-number">{stats.averageRating}</div>
            <div className="rating-stars">{renderStars(Math.round(stats.averageRating))}</div>
            <div className="total-reviews">{stats.totalReviews} reviews</div>
          </div>
        </div>

        <div className="breakdown-card">
          <h3 className="breakdown-title">Rating Breakdown</h3>
          <div className="breakdown-list">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="breakdown-row">
                <span className="star-label">{star} ⭐</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${getPercentage(stats.breakdown[star])}%` }}
                  ></div>
                </div>
                <span className="count-label">{stats.breakdown[star]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ratings Table */}
      <div className="table-container">
        <h3 className="table-title">All Reviews</h3>
        <table className="ratings-table">
          <thead>
            <tr>
              <th>Trip</th>
              <th>User</th>
              <th>Driver</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {ratings.map((rating) => (
              <tr key={rating.id}>
                <td className="trip-id">{rating.tripId}</td>
                <td>{rating.user}</td>
                <td>{rating.driver}</td>
                <td>
                  <div className="rating-cell">
                    <span className="rating-stars-small">{renderStars(rating.rating)}</span>
                    <span className="rating-value">{rating.rating}/5</span>
                  </div>
                </td>
                <td className="comment-cell">{rating.comment}</td>
                <td>{new Date(rating.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {ratings.length === 0 && (
          <div className="no-data">No ratings found</div>
        )}
      </div>
    </div>
  );
};

export default Ratings;
