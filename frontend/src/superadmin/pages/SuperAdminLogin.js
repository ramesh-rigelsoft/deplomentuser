import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ShieldLock, Key, Envelope, ArrowRight } from 'react-bootstrap-icons';
import { superAdminApi } from '../api/superAdminApi';

export default function SuperAdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: 'superadmin@rigelsoft.com',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Please provide both username and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await superAdminApi.login(formData);
      const data = res.data;
      if (data && data.token) {
        Cookies.set('superAdminToken', data.token, { expires: 1 });
        Cookies.set('superAdminUser', JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
        }), { expires: 1 });

        navigate('/super-admin/dashboard');
      } else {
        setError('Login failed: Token not received.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid Super Admin credentials or inactive account.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '20px',
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          width: '100%',
          maxWidth: '430px',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
        }}
      >
        <div className="card-header bg-dark text-white text-center py-4 border-0">
          <div className="d-inline-flex p-3 rounded-circle bg-warning text-dark mb-2">
            <ShieldLock size={36} />
          </div>
          <h4 className="fw-bold mb-0">Super Admin Portal</h4>
          <small className="text-secondary">Secured SaaS Management Console</small>
        </div>

        <div className="card-body p-4">
          {error && (
            <div className="alert alert-danger py-2 px-3 small d-flex align-items-center" role="alert">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">Super Admin Email / Username</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Envelope className="text-secondary" />
                </span>
                <input
                  type="text"
                  name="username"
                  className="form-control border-start-0"
                  placeholder="superadmin@rigelsoft.com"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold text-secondary">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Key className="text-secondary" />
                </span>
                <input
                  type="password"
                  name="password"
                  className="form-control border-start-0"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <small className="text-muted d-block mt-1">Default credentials: superadmin@rigelsoft.com / SuperAdmin@123</small>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center shadow-sm"
              style={{ borderRadius: '8px' }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing In...
                </>
              ) : (
                <>
                  <span>Sign In to Super Admin</span>
                  <ArrowRight className="ms-2" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="card-footer bg-light text-center py-3 border-0 small text-muted">
          <span>Standard Admin or Staff? </span>
          <a href="/login" className="text-decoration-none fw-semibold">
            Tenant Login
          </a>
        </div>
      </div>
    </div>
  );
}

