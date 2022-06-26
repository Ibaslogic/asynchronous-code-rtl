import { useState, useEffect } from "react";
import axios from "axios";

const RenderPosts = () => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/posts?_limit=3`
        );
        setPosts(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setPosts(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="wrapper">
      {loading && <div>A moment please...</div>}
      {error && <div>{`Problem fetching the post data - ${error}`}</div>}
      <ul>
        {posts &&
          posts.map(({ id, title }) => (
            <li key={id}>
              <h3>{title}</h3>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default RenderPosts;
