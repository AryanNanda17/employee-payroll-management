import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BiLogOut } from 'react-icons/bi'
import { FiSettings } from 'react-icons/fi'
import { MdKeyboardArrowDown } from 'react-icons/md'
import axios from '../../../../api/axios'

const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

const isDefaultPhoto = (url) => !url || url.includes('default.jpg') || url.includes('default.png')


const DropdownAdmin = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [user, setUser] = useState({ name: '', photo: '' })

  const trigger = useRef(null)
  const dropdown = useRef(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('/me')
        setUser({
          name: data.employee_name || '',
          photo: data.url || ''
        })
      } catch {
        setUser({ name: 'Admin', photo: '' })
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return
      setDropdownOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  })

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return
      setDropdownOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  return (
    <div className='relative'>
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className='flex items-center gap-4'
        to='#'
      >
        <span className='hidden text-right lg:block'>
          <span className='block text-sm font-medium text-black dark:text-white'>
            {user.name || 'Admin'}
          </span>
          <span className='block text-xs'>Administrator</span>
        </span>

        <span className='h-12 w-12 flex-shrink-0'>
          {isDefaultPhoto(user.photo) ? (
            <span className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-lg'>
              {getInitials(user.name)}
            </span>
          ) : (
            <img className='rounded-full h-12 w-12 object-cover' src={user.photo} alt='Admin' />
          )}
        </span>

        <MdKeyboardArrowDown className="text-xl" />
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen === true ? 'block' : 'hidden'
          }`}
      >
        <ul className='flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark'>
          <li>
            <Link
              to='/admin/settings/change-password'
              className='flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base'
            >
              <FiSettings className="text-xl" />
              Settings
            </Link>
          </li>
          <li>
          </li>
          <li>
            <Link
              to='/'
              className='flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base'
            >
              <BiLogOut className="text-xl" />
              Log Out
            </Link>
          </li>
        </ul>
      </div>
      {/* <!-- Dropdown End --> */}
    </div>
  )
}

export default DropdownAdmin;
