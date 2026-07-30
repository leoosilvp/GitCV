import { Navigate, useParams, Link } from 'react-router-dom';
import Footer from '../components/Footer'
import Header from '../components/Header'
import '../css/user.css'
import { useUser } from '../hooks/useUser';
import ContributionPanel from '../components/ContributionPanel';
import { LogoGithub, LogoInstagram, LogoLinkedin, Location, Wikis, FaceDissatisfied, WarningAlt } from '@carbon/icons-react';
import TopLanguages from '../components/resume/TopLanguages';
import TopProjects from '../components/resume/TopProjects';
import Performance from '../components/resume/Performance';
import { useGithubContributions } from '../hooks/useGithubContributions';
import { useUserProfile } from '../hooks/useUsersProfile';
import { useEffect } from 'react';
import { recordRecentSearch } from '../hooks/useRecentSearches';

const User = () => {

    const { username } = useParams();
    const { user } = useUser();

    if (username === user?.username) return <Navigate to='/resume' replace />

    return <UserProfile key={username} username={username} />
}

const UserProfile = ({ username }) => {
    const { contributions, isLoading: isContributionsLoading } = useGithubContributions(username)
    const { profile, isLoading: isUserLoading, isNotFound, error } = useUserProfile(username)

    const isLoading = isUserLoading || isContributionsLoading

    useEffect(() => {
        if (!isLoading && !isNotFound && !error) {
            recordRecentSearch(username)
        }
    }, [username, isLoading, isNotFound, error])


    const formattedDate = new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date());

    function getFirstName() {
        return profile?.name?.trim().split(/\s+/)[0] || profile?.login || username || ""
    }

    if (isNotFound) {
        return (
            <main className='user-main'>
                <Header path={username} />
                <section className='user-content'>
                    <div className='user-content-status'>
                        <FaceDissatisfied size={25} />
                        <p>User <strong>{username}</strong> was not found on GitHub.</p>
                    </div>
                </section>
                <Footer />
            </main>
        )
    }

    if (isLoading) {
        return (
            <main className='user-main'>
                <Header path={username} />
                <section className='user-content'>
                    <article className='resume-view'>
                        <div className='skeleton' />
                    </article>
                </section>
                <Footer />
            </main>
        )
    }

    if (error) {
        return (
            <main className='user-main'>
                <Header path={username} />
                <section className='user-content'>
                    <div className='user-content-status'>
                        <WarningAlt size={25} />
                        <p>Failed to load <strong>{username}</strong>'s profile. Please try again.</p>
                    </div>
                </section>
                <Footer />
            </main>
        )
    }

    return (
        <main className='user-main'>
            <Header path={username} />
            <section className='user-content'>
                <article className='resume-view'>
                    <header className='resume-header'>
                        <div className='resume-header-info'>
                            <img src={profile?.avatarUrl} alt={profile?.login} />
                            <div>
                                <h1>{profile?.name || profile?.login}</h1>
                                <h2>{profile?.company}</h2>
                                <p>{profile?.bio}</p>
                            </div>
                        </div>

                        <div className='resume-header-links'>
                            <Link to={`https://github.com/${profile?.login ?? username}`} target='_blank'>
                                <LogoGithub size={17} />github/{getFirstName()}
                            </Link>
                            {profile?.linkedinUrl &&
                                <>
                                    <p>|</p>
                                    <Link to={profile.linkedinUrl} target='_blank'>
                                        <LogoLinkedin size={17} />linkedin/{getFirstName()}
                                    </Link>
                                </>
                            }
                            {profile?.instagramUrl &&
                                <>
                                    <p>|</p>
                                    <Link to={profile.instagramUrl} target='_blank'>
                                        <LogoInstagram size={16} />instagram/{getFirstName()}
                                    </Link>
                                </>
                            }
                            {profile?.websiteUrl &&
                                <>
                                    <p>|</p>
                                    <Link to={profile.websiteUrl} target='_blank'>
                                        <Wikis size={16} />site/{getFirstName()}
                                    </Link>
                                </>
                            }
                            {profile?.location &&
                                <>
                                    <p>|</p>
                                    <Link><Location size={16} />{profile.location}</Link>
                                </>
                            }
                        </div>
                    </header>

                    <div className='resume-divider'>
                        <h1>Contribution Activity (Last 12 months)</h1>
                        <hr />
                    </div>

                    <section className='resume-contributionPanel'>
                        <ContributionPanel isDownload username={username} />
                    </section>

                    <div className='resume-divider'>
                        <h1>GitHub Performance (Last 12 months)</h1>
                        <hr />
                    </div>

                    <section className='resume-performance'>
                        <Performance username={username} contributions={contributions} />
                    </section>

                    <div className='resume-divider'>
                        <h1>Top Languages</h1>
                        <hr />
                    </div>

                    <section className='resume-toplanguages'>
                        <TopLanguages username={username} />
                    </section>

                    <div className='resume-divider'>
                        <h1>Top Projects</h1>
                        <hr />
                    </div>

                    <section className='resume-top-projects'>
                        <TopProjects username={username} />
                    </section>

                    <footer className='resume-footer'>
                        <p>{formattedDate}</p>
                        <p>Generated by <a href='https://gitcv-app.vercel.app/' target='_blank' >GitCV</a></p>
                    </footer>
                </article>
            </section>
            <Footer />
        </main>
    )
}

export default User