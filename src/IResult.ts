import { Rule } from "./IRule.js";

export interface Result { 
    rule: Rule,
    satisfied: boolean, 
    reason?: string 
}