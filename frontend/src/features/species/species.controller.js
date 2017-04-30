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
          name:         'Hawksbill Turtle',
          latinname:    '',
          overview:     '',
          habitat:      ''
        }
        break
         case "North American Elk":
        this.data = {
          name:         'North American Elk',
          latinname:    'Cervus canadensis',
          overview:     'The barn swallow is the most widespread species of swallow in the world. It is a distinctive passerine bird with blue upperparts, a long, deeply forked tail and curved, pointed wings. It is found in Europe, Asia, Africa and the Americas.',
          habitat:      'The preferred habitat of the barn swallow is open country with low vegetation, such as pasture, meadows and farmland, preferably with nearby water. This swallow avoids heavily wooded or precipitous areas and densely built-up locations. The presence of accessible open structures such as barns, stables, or culverts to provide nesting sites, and exposed locations such as wires, roof ridges or bare branches for perching, are also important in the bird\'s selection of its breeding range.'
        }
        break
      default:
        this.data = { error: 'We couldn\'t find that species.' }
    }
    // Load species data from a restful endpoint, eventually

  }
}
