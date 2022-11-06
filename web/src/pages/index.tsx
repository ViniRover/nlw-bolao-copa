import Image from 'next/image'
import { GetStaticProps } from 'next'

import appPreview from '../assets/app-nlw-copa-preview.png'
import logoImage from '../assets/logo.svg'
import userAvatarExampleImg from '../assets/users-avatar-example.png'
import iconCheckImg from '../assets/icon-check.svg'
import { axiosApi } from '../lib/axios'
import { FormEvent, useState } from 'react'

interface HomeProps {
  poolCount: number
  guessCount: number
  userCount: number
}

export default function Home({ poolCount, guessCount, userCount }: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')

  async function createPool(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await axiosApi.post('/pools', {
        title: poolTitle,
      })

      const { code } = response.data

      await navigator.clipboard.writeText(code)

      alert('Bolão criado com sucesso, o código foi copiado')
      setPoolTitle('')
    } catch (err) {
      alert('Falha ao criar o bolão, tente novamente!')
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImage} alt="NLW Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={userAvatarExampleImg} alt="" />

          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{userCount}</span> pessoas já
            estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            placeholder="Qual nome do seu bolão?"
            onChange={(e) => setPoolTitle(e.target.value)}
            value={poolTitle}
            required
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600" />
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={appPreview}
        alt="Dois celular mostrando uma prévia do aplicativo"
        quality={100}
      />
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      axiosApi.get('pools/count'),
      axiosApi.get('guesses/count'),
      axiosApi.get('users/count'),
    ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
    revalidate: 60 * 10, // 10 minutes
  }
}
