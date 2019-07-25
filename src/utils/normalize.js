// Nouns to normalize
const nouns = ['Java', 'UI', 'Web', 'PHP', 'Android', 'iOS', 'NET', 'Cocos2d']
const lowerCasedNouns = nouns.map(noun => noun.toLowerCase())
const re = RegExp(`(.*)(${nouns.join('|')})(.*)`, 'i')

export default str => {
  // '高级java工程师' -> ['高级java工程师', '高级', 'java', '工程师']
  const [, head, noun, tail] = re.exec(str) || []

  if (noun) {
    const index = lowerCasedNouns.indexOf(noun.toLowerCase())

    return `${head}${nouns[index]}${tail}`
  }

  return str
}
