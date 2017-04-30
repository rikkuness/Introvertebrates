export default class SpeciesController {
  constructor($stateParams) {
    console.log($stateParams)

    switch($stateParams.name) {
      case "polarbear":
        this.data = {
          name:         'Polar Bear',
          latinname:    'Ursus maritimus',
          overview:     'The polar bear is a carnivorous bear whose native range lies largely within the Arctic Circle, encompassing the Arctic Ocean, its surrounding seas and surrounding land masses.',
          habitat:      'The polar bear is a marine mammal because it spends many months of the year at sea. However, it is the only living marine mammal with powerful, large limbs and feet that allow them to cover miles on foot and run on land.',
          conservation: 'Polar bear population sizes and trends are difficult to estimate accurately because they occupy remote home ranges and exist at low population densities. Polar bear fieldwork can also be hazardous to researchers.'
        }
        break
      case "swallow":
        this.data = {
          name:         'Barn Swallow',
          latinname:    'Hirundo rustica',
          overview:     'The barn swallow is the most widespread species of swallow in the world. It is a distinctive passerine bird with blue upperparts, a long, deeply forked tail and curved, pointed wings. It is found in Europe, Asia, Africa and the Americas.',
          habitat:      'The preferred habitat of the barn swallow is open country with low vegetation, such as pasture, meadows and farmland, preferably with nearby water. This swallow avoids heavily wooded or precipitous areas and densely built-up locations. The presence of accessible open structures such as barns, stables, or culverts to provide nesting sites, and exposed locations such as wires, roof ridges or bare branches for perching, are also important in the bird\'s selection of its breeding range.'
        }
        break
      case "hawksbill":
        this.data = {
          name:         'Hawksbill Sea Turtle',
          latinname:    'Eretmochelys imbricata',
          overview:     'The hawksbill sea turtle is a critically endangered sea turtle belonging to the family Cheloniidae. It is the only extant species in the genus Eretmochelys. The species has a worldwide distribution, with Atlantic and Indo-Pacific subspecies—E. i. imbricata and E. i. bissa, respectively.',
          habitat:      'Adult hawksbill sea turtles are primarily found in tropical coral reefs. They are usually seen resting in caves and ledges in and around these reefs throughout the day. As a highly migratory species, they inhabit a wide range of habitats, from the open ocean to lagoons and even mangrove swamps in estuaries.'
        }
        break
      case "elk":
        this.data = {
          name:         'North American Elk',
          latinname:    'Cervus canadensis',
          overview:     'The elk, or wapiti, is one of the largest species within the deer family, Cervidae, in the world, and one of the largest land mammals in North America and Eastern Asia. This animal should not be confused with the still larger moose (Alces alces) to which the name "elk" applies in British English and in reference to populations in Eurasia.',
          habitat:      null
        }
        break
      default:
        this.data = { error: 'We couldn\'t find that species.' }
    }
    // Load species data from a restful endpoint, eventually

  }
}
