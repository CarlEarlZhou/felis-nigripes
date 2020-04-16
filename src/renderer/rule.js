export default function(file, rule) {
    let rule_part_list = rule.rule
    let flag = true
    for (let rule_part of rule_part_list) {
        if (rule_part.type == 'contains') {
            flag = testContains(file, rule_part)
            if (!flag)
                break
        }
        else if (rule_part.type == 'end') {
            flag = testEnd(file, rule_part)
            if (!flag)
                break
        }
    }
    return flag
}


function testContains(file, rule_part) {
    let value = rule_part.value
    let re = new RegExp(value)
    return re.test(file.name)
}

function testEnd(file, rule_part) {
    let value = rule_part.value
    let re = new RegExp('\\.' + value + '$')
    return re.test(file.name)
}