// Nouns to normalize
const nouns = ['Java', 'UI', 'Web', 'PHP', 'Android', 'iOS', 'NET', 'Cocos2d']
// Extra nouns
nouns.push('SaaS', 'Golang', 'Linux')
const lowercaseNouns = nouns.map(noun => noun.toLowerCase())

const re = RegExp(`(.*)(${nouns.join('|')})(.*)`, 'i')

export default str => {
  const groups = str.match(re)

  if (groups) {
    const [, head, noun, tail] = groups
    const index = lowercaseNouns.indexOf(noun.toLowerCase())

    return `${head}${nouns[index]}${tail}`
  }

  return str
}
