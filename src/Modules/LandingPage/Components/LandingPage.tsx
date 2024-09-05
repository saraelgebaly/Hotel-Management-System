import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Footer from '../../Shared/Footer'
import NavBarUser from '../../Shared/NavBarUser'

function LandingPage() {
  
  return (
    <div>
    <NavBarUser/>

      <Box sx={{marginTop:{xs:'45px',lg:'65px'},py:3}}>
        <Outlet/>

      </Box>
   
    <Footer />
  </div>
  )
}

export default LandingPage