import { useState, useEffect } from 'react'
import { useAuth } from '../store/authStore'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import axios from 'axios'
import {
  articleGrid,
  articleCardClass,
  articleTitle,
  articleBody,
  ghostBtn,
  loadingClass,
  errorClass,
  timestampClass,
} from "../styles/common.js";

function UserProfile() {
  const currentUser = useAuth(state => state.currentUser)
  const logout = useAuth(state => state.logout)
  const navigate = useNavigate()
  
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onLogout = async () => {
    await logout()
    toast.success("Logged out successfully")
    navigate("/login")
  }

  const navigateToArticleById = (articleObj) => {
    navigate(`/article/${articleObj._id}`, { state: articleObj })
  }

  useEffect(() => {
    const getAllArticles = async () => {
      setLoading(true)
      try {
        const res = await axios.get("http://localhost:4000/user-api/articles", { withCredentials: true })
        setArticles(res.data.payload)
      } catch (err) {
        console.error("Error fetching articles:", err)
        setError(err.response?.data?.error || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }
    getAllArticles()
  }, [])

  // convert UTC → IST
  const formatDateIST = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  if (loading) return <p className={loadingClass}>Loading articles...</p>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {error && <p className={errorClass}>{error}</p>}

      {/* Profile Header */}
      {currentUser && (
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.profileImageUrl || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cbd5e1'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-1-5.48-2.67C7.62 16.27 9.66 15 12 15s4.38 1.27 5.48 2.33C16.43 19 14.03 20 12 20z'/></svg>"}
              alt="profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome, {currentUser.firstName}</h2>
          </div>
          <button
            onClick={onLogout}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded shadow-sm transition-colors"
          >
            Logout
          </button>
        </div>
      )}

      {/* Articles Grid */}
      {articles?.length > 0 ? (
        <div className={articleGrid}>
          {articles.map(articleObj => (
            <div key={articleObj._id} className={articleCardClass}>
              <div className="flex flex-col h-full p-4">
                <div className="flex-1">
                  <h3 className={articleTitle}>{articleObj.title}</h3>
                  <p className={articleBody}>{articleObj.content.slice(0, 120)}...</p>
                  <p className={timestampClass}>{formatDateIST(articleObj.createdAt)}</p>
                </div>
                <button
                  className={`${ghostBtn} mt-4 self-start`}
                  onClick={() => navigateToArticleById(articleObj)}
                >
                  Read Article →
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-12">No articles found</p>
      )}
    </div>
  )
}

export default UserProfile