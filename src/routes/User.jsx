import { Navigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer'
import Header from '../components/Header'
import '../css/user.css'
import { useUser } from '../hooks/useUser';

const User = () => {

    const { username } = useParams();
    const { user } = useUser();

    if (username === user?.username) return <Navigate to='/resume' replace />

    return (
        <main className='user-main'>
            <Header path={username} />
            <section className='user-content'>

            </section>
            <Footer />
        </main>
    )
}

export default User
