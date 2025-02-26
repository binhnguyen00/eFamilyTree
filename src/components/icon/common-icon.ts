import { BiSolidFileJpg, BiSolidFilePng } from "react-icons/bi";
import { BsArchiveFill, BsFiletypeSvg, BsFillFilePersonFill, BsFillPeopleFill } from "react-icons/bs";
import { FaArrowDown, FaArrowLeft, FaArrowRight, FaArrowUp, FaChevronDown, FaChevronUp, FaChild, FaFileDownload, FaInfoCircle, FaPhoneAlt, FaRegCopy, FaRegSave } from "react-icons/fa";
import { FaFilePdf, FaMapLocationDot } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { GrMap } from "react-icons/gr";
import { HiOutlineDotsVertical, HiOutlineLightBulb } from "react-icons/hi";
import { IoIosArrowBack, IoIosArrowForward, IoIosCloseCircle, IoIosCloudDownload, IoMdAdd, IoMdLogIn } from "react-icons/io";
import { IoNotifications, IoPersonAddSharp, IoPersonCircle, IoTrash } from "react-icons/io5";
import { LuCalendarPlus, LuMinus } from "react-icons/lu";
import { MdAddLocationAlt, MdOutlinePreview, MdPersonSearch } from "react-icons/md";
import { PiTreeFill } from "react-icons/pi";
import { RiMailSendLine, RiResetRightLine } from "react-icons/ri";
import { TbLogout, TbPhoto, TbPhotoMinus, TbPhotoPlus } from "react-icons/tb";
import { TiZoomInOutline, TiZoomOutOutline } from "react-icons/ti";
import { TbReload } from "react-icons/tb";

export const CommonIcon = {
  Home: GoHomeFill,
  Photo: TbPhoto,
  AddPhoto: TbPhotoPlus,
  User: IoPersonCircle,
  Notification: IoNotifications,
  Tree: PiTreeFill,
  Info: FaInfoCircle,
  ZoomIn: TiZoomInOutline,
  ZoomOut: TiZoomOutOutline,
  ChevonRight: IoIosArrowForward,
  ChevonLeft: IoIosArrowBack,
  ChevonDown: FaChevronDown,
  ChevonUp: FaChevronUp,
  Plus: IoMdAdd,
  Minus: LuMinus,
  Login: IoMdLogIn,
  Logout: TbLogout,
  SearchPerson: MdPersonSearch,
  Reset: RiResetRightLine,
  Phone: FaPhoneAlt,
  PDF: FaFilePdf,
  PNG: BiSolidFilePng,
  JPG: BiSolidFileJpg,
  SVG: BsFiletypeSvg,
  CloudDownload: IoIosCloudDownload,
  FileDownload: FaFileDownload,
  CloseCircle: IoIosCloseCircle,
  VerticalDots: HiOutlineDotsVertical,
  Save: FaRegSave,
  Map: GrMap,
  CurrentPosition: FaMapLocationDot,
  LightBulb: HiOutlineLightBulb,
  Trash: IoTrash,
  Archive: BsArchiveFill,
  AddMarker: MdAddLocationAlt,
  AddPerson: IoPersonAddSharp,
  Child: FaChild,
  People: BsFillPeopleFill,
  Preview: MdOutlinePreview,
  AddEvent: LuCalendarPlus,
  RemovePhoto: TbPhotoMinus,
  Copy: FaRegCopy,
  FilePerson: BsFillFilePersonFill,
  ArrowDown: FaArrowDown,
  ArrowLeft: FaArrowLeft,
  ArrowRight: FaArrowRight,
  ArrowUp: FaArrowUp,
  SendMail: RiMailSendLine,
  Reload: TbReload,
};