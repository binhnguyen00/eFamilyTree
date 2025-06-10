import { BiMaleFemale, BiSolidFileJpg, BiSolidFilePng, BiSolidSave } from "react-icons/bi";
import { BsArchiveFill, BsFiletypeSvg, BsFillFilePersonFill, BsFillHouseAddFill, BsFillPeopleFill } from "react-icons/bs";
import { FaArrowDown, FaArrowLeft, FaArrowRight, FaArrowUp, FaCheck, FaCheckCircle, FaChevronDown, FaChevronUp, FaChild, FaFileDownload, FaInfoCircle, FaPhoneAlt, FaRegCalendarAlt, FaRegCopy } from "react-icons/fa";
import { FaBookBookmark, FaFilePdf, FaMapLocationDot, FaMountainSun, FaRegSquareCheck } from "react-icons/fa6";
import { GiFamilyTree, GiGraveFlowers } from "react-icons/gi";
import { GoHomeFill } from "react-icons/go";
import { GrMap } from "react-icons/gr";
import { HiOutlineDotsVertical, HiOutlineLightBulb } from "react-icons/hi";
import { IoIosArrowBack, IoIosArrowForward, IoIosCloseCircle, IoIosCloudDownload, IoMdAdd, IoMdLogIn } from "react-icons/io";
import { IoNotifications, IoPersonAddSharp, IoPersonCircle, IoQrCodeOutline, IoTrash } from "react-icons/io5";
import { LuCalendarPlus, LuMinus } from "react-icons/lu";
import { MdAddLocationAlt, MdFamilyRestroom, MdOutlinePreview, MdPersonSearch } from "react-icons/md";
import { PiMapPinFill, PiTreeFill } from "react-icons/pi";
import { RiMailSendLine, RiResetRightLine } from "react-icons/ri";
import { TbLogout, TbPhoto, TbPhotoMinus, TbPhotoPlus, TbReload } from "react-icons/tb";
import { TiZoomInOutline, TiZoomOutOutline } from "react-icons/ti";
import { IoMdPhotos } from "react-icons/io";

export const CommonIcon = {
  Home: GoHomeFill,
  Photo: TbPhoto,
  Photos: IoMdPhotos,
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
  Save: BiSolidSave,
  Map: GrMap,
  Map2: FaMapLocationDot,
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
  RegisterClan: BsFillHouseAddFill,
  MaleFemale: BiMaleFemale,
  FamilyTree: GiFamilyTree,
  Family: MdFamilyRestroom,
  Grave: GiGraveFlowers,
  Gallery: FaRegCalendarAlt,
  QRCode: IoQrCodeOutline,
  CheckCircle: FaCheckCircle,
  CheckSquare: FaRegSquareCheck,
  Check: FaCheck,
  Bookmark: FaBookBookmark,
  Terrain: FaMountainSun,
  MapPin: PiMapPinFill,
};