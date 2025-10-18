import React, { useState } from 'react'
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ email: "", password: "", skills: "",role:""}); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlesignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      
      const skillsArray = form.skills
        .split(",")
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0); 

      const payload = {
        email: form.email,
        password: form.password,
        skills: skillsArray,
        role:form.role
      };

      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        alert(data.message || "Signup failed");
      }

    } catch (error) {
      alert("Something went wrong");
      console.error(error);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-xl bg-base-100">
        <form onSubmit={handlesignup} className="card-body">
          <h2 className="card-title justify-center">Sign Up</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered w-full"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="skills"
            placeholder="Skills (comma separated)"
            className="input input-bordered w-full"
            value={form.skills}
            onChange={handleChange}
          />
          <select
                className="select select-bordered w-full"
                value={form.role}
                placeholder="Select your role"
               onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
                required
          >
              <option value="" disabled selected>
              Select your role
            </option>
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>

          <div className="form-control mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
          <div className='mt-2'>
            Already have an account? <Link to="/login" className='underline text-blue-500'>Login</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
