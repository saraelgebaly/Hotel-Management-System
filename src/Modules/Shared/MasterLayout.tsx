import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import SideBar from './SideBar'
function MasterLayout() {
  return (
    <>
    <Box display="flex" className="font-main">

      <SideBar/>

        
      <Box 
        flex="1" 
        className='Content'
        height="100vh" 
        p={{xs:1,md:3}} 
        px={{ md: 5 }} 
        py={{ xs:2,md: 4 }}
        pb={{xs:6}} 
        overflow="auto"
      >
        <NavBar/>
        <Outlet />
      

      </Box>
        
        
    </Box>


    
    </>
  )
}

export default MasterLayout