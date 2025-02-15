import { boot } from 'quasar/wrappers'
import { useSpecializationsStore} from "stores/specializations.js";

export default boot(async () => {
  const specializationsStore = useSpecializationsStore()
  await specializationsStore.getSpecializations()
})
