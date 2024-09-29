import React, { useEffect, useState } from 'react';
import '../styles/UserForm.scss'; // підключаємо стилі
import { useNavigate } from 'react-router-dom';

interface Position {
  id: number;
  name: string;
}

const UserForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [positionId, setPositionId] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<any>({}); // State to hold validation errors
  const [positions, setPositions] = useState<Position[]>([]); // State to hold positions
  const [token, setToken] = useState<string>('');
  const navigate = useNavigate();

  // Fetch positions from the server
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/positions`);
        const data = await response.json();

        if (data.success) {
          setPositions(data.positions); // Store positions in state
        } else {
          console.error('Failed to load positions.');
        }
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    };

    fetchPositions();

    const fetchToken = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/token`);
        const data = await response.json();

        if (data.success) {
          setToken(data.token); // Store token in state
        } else {
          console.error('Failed to load token.');
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('position_id', positionId);
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users?token=${token}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 422 && errorData.fails) {
          setErrors(errorData.fails);
        } else {
          console.error('Server error: ', errorData.message);
        }
      } else {
        setErrors({});
        navigate('/');
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  return (
    <div className="user-form-container">
      <form className="user-form" onSubmit={handleSubmit}>
        <h2>Create User</h2>

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="error">{errors.name[0]}</p>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error">{errors.email[0]}</p>}
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && <p className="error">{errors.phone[0]}</p>}
        </div>

        <div className="form-group">
          <label>Position</label>
          <select
            value={positionId}
            onChange={(e) => setPositionId(e.target.value)}
          >
            <option value="">Select position</option>
            {positions.map((position) => (
              <option key={position.id} value={position.id}>
                {position.name}
              </option>
            ))}
          </select>
          {errors.position_id && <p className="error">{errors.position_id[0]}</p>}
        </div>

        <div className="form-group">
          <label>Photo</label>
          <input
            type="file"
            onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
          />
          {errors.photo && <p className="error">{errors.photo[0]}</p>}
        </div>

        <button className="submit-button" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UserForm;
