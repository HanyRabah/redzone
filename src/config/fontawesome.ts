import { config, library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

// Tell Font Awesome to skip adding the CSS automatically since it's being imported above
config.autoAddCss = false;

// Add all icons to the library so you can use them without importing individually
library.add(fas, far, fab)
