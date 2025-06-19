import './HeaderComponent.css'
import logo from './IHO_Logo_85px.png'
import banner from './dcdb_banner_gb.png'

type AppProps = {
  title: string
}

export default function HeaderComponent({ title }: AppProps) {
    const baseClass = 'HeaderComponent'

  return (
    <div className={baseClass}>
        <img src={logo} height='60px'></img>
        <h2 style={{margin:'auto'}}>{title}</h2>
        <img src={banner} height='60px'></img>
        
    </div>
  )
}