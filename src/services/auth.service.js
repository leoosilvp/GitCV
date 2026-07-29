const BASE_URL = 'https://api-gitcv-app.vercel.app/api/auth'

export function loginWithGithub() {
    window.location.href = `${BASE_URL}/github`
}

export async function getMe() {
    const res = await fetch(`${BASE_URL}/me`, {
        credentials: 'include',
        cache: 'no-store',
    })

    if (!res.ok) return null

    return res.json()
}

export async function logout() {
    await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
    })

    window.location.href = '/'
}