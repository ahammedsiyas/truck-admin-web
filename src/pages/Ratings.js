import React, { useState, useEffect } from 'react';
import './Ratings.css';
import { getRatings } from '../services/rating';
const Ratings = () => {
  const [ratings, setRatings] = useState([]);

  
    console.log(ratings);
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

    const response = await getRatings();
    console.log(response);
    

    const realRatings = response.data;
    const realStats = response.stats;

    setRatings(
      realRatings.map((r) => ({
        id: r._id,
        tripId: r.trip?.bookingId || r.trip?._id,
        user: `${r.user?.firstName || ""} ${r.user?.lastName || ""}`,
        driver: `${r.driver?.userId?.firstName || ""} ${r.driver?.userId?.lastName || ""}`,
        rating: r.rating,
        comment: r.comment,
        date: r.createdAt,
      }))
    );

    

    setStats(realStats);

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
                <td className="comment-cell">{rating.comment||"No Comments"}</td>
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
