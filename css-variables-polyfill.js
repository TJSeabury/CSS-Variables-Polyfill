/*
* Replace css variables with their values if the browser does not support them.
*/
if ( 
    window.CSS && 
    window.CSS.supports && 
    window.CSS.supports( '--css-variable', 0 ) 
)
{
    let stylesheets = Array.from( document.styleSheets );

    // Extract varaible declarations
    let variables = new Object();
    let unresolvedVariables = new Object();
    
    do
    {
        for ( let sheet of stylesheets )
        {
            if ( 
                null !== sheet && 
                null !== sheet.href && 
                sheet.href.includes( 'vulcan' ) 
            )
            {
                let the_sheet = Array.from( sheet.rules );
                for ( let rule of the_sheet )
                {
                    if ( 
                        null !== rule.cssText && 
                        null !== rule.style && 
                        undefined !== rule.style && 
                        -1 < rule.cssText.indexOf( '--' ) && 
                        ( 
                            rule.cssText.indexOf( '--' ) < rule.cssText.indexOf( 'var(' ) ||
                            -1 === rule.cssText.indexOf( 'var(' )
                        )
                    )
                    {
                        let pattern_declaration = /--(.+?):(.+?);/g;
                        let pattern_varFull = /var\(--.+?\)/g;
                        let pattern_varName = /var\(--(.+?)\)/g;
                        let match;
                        while ( null !== ( match = pattern_declaration.exec( rule.cssText ) ) )
                        {
                            let varName = null;
                            if ( -1 !== match[2].indexOf( 'var(' ) )
                            {
                                let patternNameMatch = pattern_varName.exec( match[2] );
                                varName = patternNameMatch[1];
                            }
                            
                            if ( -1 === match[2].indexOf( 'var(' ) )
                            {
                                variables[match[1]] = match[2].trim();
                            }
                            else if ( null !== varName && unresolvedVariables[match[1]] && variables[varName] )
                            {
                                let value = unresolvedVariables[match[1]].replace( pattern_varFull.exec( unresolvedVariables[match[1]] ), variables[varName] );
                                variables[match[1]] = value.trim();
                                delete unresolvedVariables[match[1]];
                            }
                            else
                            {
                                unresolvedVariables[match[1]] = match[2];
                            }
                        }
                    }
                }
            }
        }
    } while ( 0 < Object.keys( unresolvedVariables ).length );


    //console.log( 'unresolved', unresolvedVariables, '\n', 'resolved', variables );
    

    // Select variables in rules that must be injected with real values.
    for ( let sheet of stylesheets )
    {
        if ( 
            null !== sheet && 
            null !== sheet.href && 
            sheet.href.includes( 'vulcan' ) 
        )
        {
            let rules = sheet.cssRules || sheet.rules;
            let the_sheet = Array.from( rules );
            for ( let rule of the_sheet )
            {
                if ( 
                    null !== rule.cssText && 
                    rule.cssText.includes( 'var(' ) && 
                    rule.cssText.indexOf( '--' ) > rule.cssText.indexOf( 'var(' ) 
                )
                {
                    let pattern_declaration = /;?([-_a-zA-Z]+[_a-zA-Z0-9-]):\s*(\s*var\(\s?--(.+?)\))+\s?(.*?)?;/g;
                    
                    let styleVals = pattern_declaration.exec( rule.cssText );
                    if ( null === styleVals )
                    {
                        continue;
                    }
                    
                    //console.log( styleVals );
                    
                    /*let important = false;
                    if ( undefined !== styleVals[3] && styleVals[3].includes('!important') )
                    {
                        important = true;
                    }

                    let styleName = styleVals[1];
                    let styleValue = variables[styleVals[2]];
                    
                    if ( important )
                    {
                        console.log( 'old style:', rule );
                        rule.style.setProperty( styleName, styleValue, ( important ? 'important' : '' ) );
                        console.log( 'new style:', rule );
                    }*/
                }
            }
        }
    }
}

/*function occurrences(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

function occurrences(string, substring) {

    var n = 0;
    var pos = 0;
    var l=substring.length;

    while (true) {
    pos = string.indexOf(substring, pos);
    if (pos > -1) {
        n++;
        pos += l;
    } else {
        break;
    }
    }
    return (n);
}*/

















