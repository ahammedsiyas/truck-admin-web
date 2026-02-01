import React, { useState, useEffect } from "react";
import * as userService from "../services/user";
import "./AdminProfileSettings.css";

export default function AdminProfileSettings() {
  const [formData, setFormData] = useState({
    dispatcherName: "",
    dispatcherEmail: "",
    dispatcherPhone: "",
    salespersonName: "",
    salespersonEmail: "",
    salespersonPhone: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  useEffect(() => {
    loadAdminProfile();
  }, []);

  const loadAdminProfile = async () => {
    try {
      setFetchingProfile(true);
      const data = await userService.getAdminProfile();
      if (data) setFormData({
        dispatcherName: data.dispatcherName || "",
        dispatcherEmail: data.dispatcherEmail || "",
        dispatcherPhone: data.dispatcherPhone || "",
        salespersonName: data.salespersonName || "",
        salespersonEmail: data.salespersonEmail || "",
        salespersonPhone: data.salespersonPhone || "",
      });
    } catch (error) {
      console.log("Error loading admin profile:", error);
    } finally {
      setFetchingProfile(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { dispatcherName, dispatcherEmail, dispatcherPhone } = formData;

    if (!dispatcherName || !dispatcherName.trim()) {
      alert("Please enter dispatcher name");
      return;
    }
    if (!dispatcherEmail || !dispatcherEmail.trim()) {
      alert("Please enter dispatcher email");
      return;
    }
    if (!dispatcherPhone || !dispatcherPhone.trim()) {
      alert("Please enter dispatcher phone");
      return;
    }

    setLoading(true);
    try {
      await userService.updateAdminProfile(formData);
      alert("Admin profile updated successfully!");
    } catch (error) {
      console.log("Error updating profile:", error);
      alert(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProfile) {
    return (
      <div className="admin-loading">Loading...</div>
    );
  }

  return (
    <div className="admin-settings-page">
      <h1 className="title">Admin Profile</h1>
      <p className="subtitle">Configure dispatcher and salesperson information</p>

      <div className="card">
        <h2 className="card-title">Dispatcher Information</h2>
        <label className="label">Dispatcher Name *</label>
        <input className="input" placeholder="Enter dispatcher name" value={formData.dispatcherName} onChange={(e)=>handleChange('dispatcherName', e.target.value)} disabled={loading} />

        <label className="label">Dispatcher Email *</label>
        <input className="input" placeholder="Enter dispatcher email" value={formData.dispatcherEmail} onChange={(e)=>handleChange('dispatcherEmail', e.target.value)} disabled={loading} />

        <label className="label">Dispatcher Phone *</label>
        <input className="input" placeholder="Enter dispatcher phone" value={formData.dispatcherPhone} onChange={(e)=>handleChange('dispatcherPhone', e.target.value)} disabled={loading} />
      </div>

      <div className="card">
        <h2 className="card-title">Salesperson Information (Optional)</h2>
        <label className="label">Salesperson Name</label>
        <input className="input" placeholder="Enter salesperson name" value={formData.salespersonName} onChange={(e)=>handleChange('salespersonName', e.target.value)} disabled={loading} />

        <label className="label">Salesperson Email</label>
        <input className="input" placeholder="Enter salesperson email" value={formData.salespersonEmail} onChange={(e)=>handleChange('salespersonEmail', e.target.value)} disabled={loading} />

        <label className="label">Salesperson Phone</label>
        <input className="input" placeholder="Enter salesperson phone" value={formData.salespersonPhone} onChange={(e)=>handleChange('salespersonPhone', e.target.value)} disabled={loading} />
      </div>

      <button className="primary-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Saving...' : 'Save Admin Profile'}
      </button>
    </div>
  );
}
 
