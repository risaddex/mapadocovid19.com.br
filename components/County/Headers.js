import Head from "next/head"
import { useRouter } from "next/router"

import countiesName from "../../utils/counties.json"

const Headers = () => {
	const router = useRouter()
	const { county } = router.query
	return (
		<Head>
			{/* twitter tags */}
			<meta
				name="twitter:title"
				content={`Mapa do COVID-19 em ${countiesName[county]}`}
			/>
			<meta
				name="twitter:description"
				content="Veja os dados nos estados e cidades brasileiras atualizados várias vezes ao dia."
			/>
			<meta name="twitter:site" content="@frontendwizard" />
			<meta name="twitter:creator" content="@frontendwizard" />
			{/* open graph tags */}
			<meta property="og:type" content="article" />
			<meta
				property="og:title"
				content={`Mapa do COVID-19 em ${countiesName[county]}`}
			/>
			<meta
				property="og:description"
				content="Veja os dados nos estados e cidades brasileiras atualizados várias vezes ao dia."
			/>
			<meta property="og:url" content="https://mapadocovid19.com.br" />
			<meta property="og:site_name" content="mapadocovid19.com.br" />
			<title>Mapa do COVID-19 em {countiesName[county]}</title>
			<link rel="icon" href="/favicon.ico" />
			<link rel="canonical" href={`https://mapadocovid19.com.br/${county}`} />
		</Head>
	)
}

export default Headers
