import { SxProps } from '@mui/material'
import { Theme } from '@mui/material/styles'

export interface ISxStyles extends Record<string, SxProps<Theme> | undefined> {}
