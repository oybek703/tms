import React from 'react'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuList from '@mui/material/MenuList'
import { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { IconButton } from '@mui/material'
import CardActionArea from '@mui/material/CardActionArea'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex'
  },
  paper: {
    marginRight: theme.spacing(2)
  },
  iconBtnRoot: {
    padding: 3
  }
}))

interface LimitsMenuProps {
  innerData: JSX.Element
}

const LimitsMenu: React.FC<LimitsMenuProps> = ({ innerData }) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open)
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <div className={classes.root}>
      <IconButton
        title='Нажмите, чтобы просмотреть подробности'
        classes={{ root: classes.iconBtnRoot }}
        ref={anchorRef}
        onClick={handleToggle}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        size="large">
        <ArrowDropDownIcon />
      </IconButton>
      <Popper style={{ zIndex: 100000 }} placement='bottom-end' open={open} anchorEl={anchorRef.current}
        role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: 'right end' }}
          >
            <Paper style={{ background: '#ebf5ff' }}>
              {/*
              @ts-ignore */}
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  <CardActionArea>
                    {innerData}
                  </CardActionArea>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  )
}

export default LimitsMenu
