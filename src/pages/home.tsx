import { useEffect, useState } from 'react';
import reactLogo from '../assets/react.svg';
import blockletLogo from '../assets/blocklet.svg';
import viteLogo from '../assets/vite.svg';
import './home.css';
import api from '../libs/api';

interface UserProfile {
  username: string;
  email: string;
  phone: string;
}

export default function Home() {
  const [profile, setProfile] = useState<UserProfile>({ username: '', email: '', phone: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/api/profile/1');
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!profile.username) newErrors.username = 'Username is required';
    if (!profile.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!profile.phone) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(profile.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      await api.put('/api/profile/1', profile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="max-w-md md:max-w-xl lg:max-w-2xl mx-auto p-4">
      <header className="flex justify-between items-center py-4">
        <div className="flex flex-1 space-x-4 flex-col sm:flex-row items-center justify-evenly">
          <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
          <a href="https://www.arcblock.io/docs/blocklet-developer/getting-started" target="_blank" rel="noreferrer">
            <img src={blockletLogo} className="logo blocklet" alt="Blocklet logo" />
          </a>
        </div>
      </header>
      <div className="max-w-md md:max-w-xl lg:max-w-2xl mx-auto bg-white dark:bg-slate-800 dark:text-white p-8 rounded-lg shadow-md">
        {isEditing ? (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Username
                <input
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  className={`block w-full p-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded`}
                />
              </label>
              {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Email
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className={`block w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
                />
              </label>
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Phone
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className={`block w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded`}
                />
              </label>
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
            <button onClick={handleSave} type="button" className="px-4 py-2 bg-blue-500 text-white rounded">
              Save
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[1fr_2fr] place-items-start">
              <strong>Username:</strong> <p className="mb-2 break-all">{profile.username}</p>
              <strong>Email:</strong> <p className="mb-2 break-all">{profile.email}</p>
              <strong>Phone:</strong> <p className="mb-2 break-all">{profile.phone}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded">
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
}
