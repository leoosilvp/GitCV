import { Fork, Launch, License, LogoGithub, Star } from '@carbon/icons-react'
import { Link } from 'react-router-dom'

const TrendingRepos = () => {

    return (
        <section className="home-trendingRepos">
            <header className='home-trendingRepos-header'>
                <h1>Trending Repository</h1>
                <Link to='https://github.com/leoosilvp/GitCV' target='_blank'><LogoGithub size={20} /></Link>
            </header>

            <section className='home-trendingRepos-grid'>
                <article className='home-trendingRepos-card'>
                    <div>
                        <header>
                            <img src="https://avatars.githubusercontent.com/u/307182956?s=40&v=4" />
                            <Link to='https://github.com/n0shake/Public-APIs' target='_blank'>n0shake/Public-APIs</Link>
                        </header>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem perferendis consequuntur praesentium iusto sint. Voluptatum quo iste exercitationem beatae facilis commodi temporibus porro. Saepe dolorem nam libero, dolor odit dignissimos!</p>
                        <footer>
                            <section>
                                <div /><span>Python</span>
                            </section>
                            <section>
                                <Star size={16} /><span>2.876</span>
                            </section>
                            <section>
                                <Fork size={16} /><span>1.890</span>
                            </section>
                            <section>
                                <License size={16} /><span>MIT</span>
                            </section>
                        </footer>
                    </div>
                    <Link className='btn-right'>Visit Repo <Launch size={16} /></Link>
                </article>
            </section>
        </section>
    )
}

export default TrendingRepos
