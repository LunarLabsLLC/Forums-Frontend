import { FaBars } from 'react-icons/fa6';
import './styles.css'

const MobileNavbar = (props: { className?: string; content: any; includeInput?: boolean; }) => {
  const includeInput = props.includeInput ?? true;
  return <>
    {includeInput ? <input id="navbar" type="checkbox" className="drawer-toggle"/> : <></>}
    <nav className="hidden drawer-side z-[3]">
      <label htmlFor="navbar" className="drawer-overlay"></label>
      <div className={`relative ${props.className || ''}`}>
        <div className="absolute h-full w-full bg-base-100 inset-0 z-[-1] sidebar-filter"></div>
        {props.content}
      </div>
    </nav>
  </>
}

export default MobileNavbar;

export const MobileNavToggle = (props: {className?: string}) =>
  <label htmlFor="navbar" tabIndex={0} className={`inline-flex expand-btn btn btn-ghost btn-circle mobile-nav-toggle ` + (props.className || '')}>
    <FaBars />
  </label>;