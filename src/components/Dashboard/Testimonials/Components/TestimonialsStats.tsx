 import { Grid, Paper, Typography,alpha,Box } from '@mui/material'
import { Testimonial } from '@prisma/client'
import { List, ActivityIcon } from 'lucide-react'
 
export default function TestimonialsStats({testimonials}: {testimonials: Testimonial[]}) {


  const statCards = [
    {
      title: 'Total Testimonials',
      value: testimonials.length,
      icon: List,
      description: 'All time submissions',
      color: '#2e7d32'
    },
    {
      title: 'Active',
      value: testimonials.filter(c => c.isActive).length,
      icon: ActivityIcon,
      description: 'Need attention',
      color: '#1976d2'
    },
  ]
  
    return  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {statCards.map((stat, index) => (
         <Grid key={index} size={{xs: 12, sm: 2}}>
         <Paper
           sx={{
             p: 3,
             borderRadius: 3,
             background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
             border: `1px solid ${alpha(stat.color, 0.2)}`,
             transition: 'all 0.2s ease',
             '&:hover': {
               transform: 'translateY(-2px)',
               boxShadow: 4
             }
           }}
         >
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             <Box
               sx={{
                 p: 1.5,
                 borderRadius: 2,
                 bgcolor: alpha(stat.color, 0.1),
                 color: stat.color
               }}
             >
               <stat.icon size={24}/>
             </Box>
             <Box>
               <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                 {stat.value}
               </Typography>
               <Typography variant="body2" color="text.secondary">
                 {stat.title}
               </Typography>
             </Box>
           </Box>
         </Paper>
       </Grid>  
      ))}
    </div>
}