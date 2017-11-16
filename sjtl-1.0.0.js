/**
* @preserve
* 
* LICENSE
* 
* SJTL (Simple Javascript Object Notation Template Language) Copyright William Spencer Ward III and SJTL engine Copyright William Spencer Ward III
* 
* Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
* 
* 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* 
* 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* 
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


/**
 * @constructor
 */
function sjtl_engine()
{
    this.s_template_divtag_id = "";
    this.s_render_divtag_id = "";
    this.s_template = "";
    this.s_html = "";
    this.i = 0;
    this.i_matching_tag = -1;
    this.o_json_parent = {};
    this.i_json_parent = -1;
    this.prev_o_json_parent = -{};
    this.i_template_parent = -1;
    this.a_tags = [];
    this.re_tag = /\{.*?\}/g;
    this.first_iteration_tag_index = [];
    this.highest_printed_plaintext_offset = 0;
    this.render_disable = -1;
    this.previous_offset = -1;

    this.o_tag =
    {
        tag_label : "",
        tag_label_subset : "",
        original_tag_label_length : -1,
        lower_bound : -1,
        upper_bound : -1,
        template_text_char_offset : -1,
        previous_offset : -1,
        o_json_parent : {},
        i_json_parent : -1,
        i_template_parent : -1,
        i_type : -1,
        iterations : -1,
        current_iteration : -1,
        plaintext_offset : -1,
        is_subset : false,
        is_inverse : false
    };
};

sjtl_engine.prototype.process_tag = function()
{
    var is_first_iteration = false;
    var object_reference = {};
    var match_tag;
    var match_next_tag;
    var o_tag = Object.create(this.o_tag);
    var s_plaintext = "";
    var prototype_name = "";
    var close_primitive = false;
    var lastIndex = -1;
    var offset1 = -1;
    var offset2 = -1;
    var leading_plaintext = false;
    
    //tag types: boolean, string, number, array, object(this is also known as a hash or associative array)
    var t_boolean = 0;
    var t_string = 1;
    var t_number = 2;
    var t_array = 3;
    var t_object = 4;

    o_tag.plaintext_offset = this.highest_printed_plaintext_offset;

    if(match_tag = this.re_tag.exec(this.s_template))
    {
        o_tag.tag_label = match_tag[0].substring(1, match_tag[0].length - 1);
        
        if(this.previous_offset < match_tag.index) o_tag.previous_offset = this.previous_offset;
        this.previous_offset = match_tag[0].length + match_tag.index;

        if(o_tag.tag_label == "-") return true;
        
        o_tag.original_tag_label_length = match_tag[0].length;
        o_tag.template_text_char_offset = match_tag.index;

        if(o_tag.tag_label != "")
        {
            o_tag.o_json_parent = this.o_json_parent;
            
            if(o_tag.tag_label.substr(0,1) == "!")
            {
                o_tag.tag_label = o_tag.tag_label.substr(1, o_tag.tag_label.length - 1);
                o_tag.is_inverse = true;
            }
        }

        if((o_tag.tag_label[0] == "[") && (o_tag.tag_label[o_tag.tag_label.length - 1] == "]"))  //if this is a subset type tag, indicated by []
        {
            o_tag.is_subset = true;
            o_tag.tag_label_subset = o_tag.tag_label.substring(1, o_tag.tag_label.length - 1); //cut off brackets
            
            if(o_tag.tag_label_subset.indexOf(":") > 0) //if this is a subset that speficies a range
            {
                o_tag.i_type = t_array;
                o_tag.lower_bound = parseInt(o_tag.tag_label_subset.split(":")[0], 10);
                object_reference = this.o_json_parent[o_tag.lower_bound];

                o_tag.upper_bound = o_tag.tag_label_subset.split(":")[1];
                if(o_tag.upper_bound == "N") o_tag.upper_bound = this.o_json_parent.length - 1;
                else o_tag.upper_bound = parseInt(o_tag.upper_bound, 10);
            }
            else //if this is a subset that speficies one member
            {
                o_tag.tag_label = o_tag.tag_label.substring(1, o_tag.tag_label.length - 1); //cut off brackets
                o_tag.lower_bound = parseInt(o_tag.tag_label_subset, 10);
                o_tag.upper_bound = o_tag.lower_bound;
                object_reference = this.o_json_parent[o_tag.tag_label];

                prototype_name = Object.prototype.toString.call(object_reference);
                switch(prototype_name)
                {
                    case "[object Array]": o_tag.i_type = t_array; break;
                    case "[object Object]": o_tag.i_type = t_object; break;
                    case "[object String]": o_tag.i_type = t_string; break;
                    case "[object Number]": o_tag.i_type = t_number; break;
                }
            }

            if(this.first_iteration_tag_index[o_tag.template_text_char_offset] == undefined) is_first_iteration = true; //if(this is first iteration? )
            else if(this.a_tags[this.first_iteration_tag_index[o_tag.template_text_char_offset]].current_iteration == -1) //if(this tag is reset to the first iteration?)
            {
                is_first_iteration = true;
                leading_plaintext = true;
                offset1 = this.a_tags[this.first_iteration_tag_index[o_tag.template_text_char_offset]].previous_offset;
                s_plaintext = this.s_template.substring(offset1, o_tag.template_text_char_offset);
                if(this.render_disable == -1) this.s_html += s_plaintext;
            }

            if(is_first_iteration)
            {
                this.first_iteration_tag_index[o_tag.template_text_char_offset] = this.i;

                o_tag.current_iteration = o_tag.lower_bound;
                o_tag.iterations = o_tag.upper_bound - o_tag.lower_bound - 1; //this represents remaining iterations
                o_tag.i_template_parent = this.i_template_parent;
                o_tag.i_json_parent = this.i_json_parent;

                if(o_tag.i_type == t_array) this.i_template_parent = this.i;
            }
            else
            {

                leading_plaintext = true;
                offset1 = this.a_tags[this.first_iteration_tag_index[o_tag.template_text_char_offset]].previous_offset;
                s_plaintext = this.s_template.substring(offset1, o_tag.template_text_char_offset);

                if(this.render_disable == -1) this.s_html += s_plaintext;

                this.a_tags[this.first_iteration_tag_index[o_tag.template_text_char_offset]].current_iteration++;
                o_tag.current_iteration = this.a_tags[this.first_iteration_tag_index[o_tag.template_text_char_offset]].current_iteration;
                o_tag.iterations = this.a_tags[this.first_iteration_tag_index[o_tag.template_text_char_offset]].iterations;
                object_reference = this.o_json_parent[o_tag.current_iteration];

                o_tag.i_template_parent = this.a_tags[this.first_iteration_tag_index[o_tag.template_text_char_offset]].i_template_parent;
                this.i_template_parent = this.first_iteration_tag_index[o_tag.template_text_char_offset];

                o_tag.i_json_parent = this.a_tags[this.first_iteration_tag_index[o_tag.template_text_char_offset]].i_json_parent;
            }

            prototype_name = Object.prototype.toString.call(object_reference);
            if((prototype_name == "[object Array]") || (prototype_name == "[object Object]"))
            {
                this.prev_o_json_parent = this.o_json_parent;
                this.o_json_parent = object_reference;
                this.i_json_parent = this.i;
            }
        }
        else if(o_tag.tag_label != "")
        {
            object_reference = this.o_json_parent[o_tag.tag_label];
            prototype_name = Object.prototype.toString.call(object_reference);

            switch(prototype_name)
            {
                case "[object Array]": o_tag.i_type = t_array; break;
                case "[object Object]": o_tag.i_type = t_object; break;
                case "[object Boolean]": o_tag.i_type = t_boolean; break;
                case "[object String]": o_tag.i_type = t_string; break;
                case "[object Number]": o_tag.i_type = t_number; break;
            }

            o_tag.i_json_parent = this.i_json_parent;
            o_tag.i_template_parent = this.i_template_parent;

            if((o_tag.i_type == t_boolean) && (!(object_reference ^ o_tag.is_inverse))) this.render_disable = this.i;
            if((o_tag.i_type == t_array) || (o_tag.i_type == t_object) || (o_tag.i_type == t_boolean)) this.i_template_parent = this.i;

            if((o_tag.i_type == t_array) || (o_tag.i_type == t_object)) 
            {
                this.i_json_parent = this.i;
                this.o_json_parent = object_reference;
            }

            if(o_tag.i_type == t_array)
            {
                o_tag.lower_bound = 0;
                o_tag.upper_bound = object_reference.length - 1;
            }
        }

        if((this.highest_printed_plaintext_offset < match_tag.index + match_tag[0].length) && !leading_plaintext)
        {
            s_plaintext = this.s_template.substring(this.highest_printed_plaintext_offset, o_tag.template_text_char_offset);

            if(this.render_disable == -1) this.s_html += s_plaintext;

            this.highest_printed_plaintext_offset += s_plaintext.length + match_tag[0].length;
        }

        if(o_tag.tag_label != "")
        {
            prototype_name = Object.prototype.toString.call(object_reference);

            if((this.render_disable == -1) && (prototype_name != "[object Array]") && (prototype_name != "[object Object]") && (o_tag.i_type != t_boolean) && (object_reference != undefined)) this.s_html += object_reference;

            if(o_tag.is_subset) this.i_matching_tag = this.first_iteration_tag_index[o_tag.template_text_char_offset];
            else this.i_matching_tag = this.i; 
        }
        
        if(o_tag.tag_label == "")
        {
            lastIndex = this.re_tag.lastIndex;
            match_next_tag = this.re_tag.exec(this.s_template);

            if(match_next_tag) offset2 = this.re_tag.lastIndex - match_next_tag[0].length;
            else offset2 = this.s_template.length;

            this.re_tag.lastIndex = lastIndex;

            if(this.render_disable == this.i_matching_tag) this.render_disable = -1;

            if(offset2 > this.highest_printed_plaintext_offset)
            {
                s_plaintext = this.s_template.substring(o_tag.template_text_char_offset + 2, offset2);
                if(this.render_disable == -1) this.s_html += s_plaintext;

                if(match_next_tag) this.highest_printed_plaintext_offset = offset2 + match_next_tag[0].length;
                else this.highest_printed_plaintext_offset = this.s_template.length;
            }

            o_tag.iterations = this.a_tags[this.i_matching_tag].iterations;
            this.i_template_parent = this.a_tags[this.i_matching_tag].i_template_parent;

            if(this.a_tags[this.i_matching_tag].is_subset)
            {
                if(o_tag.iterations > -1)
                {
                    this.highest_printed_plaintext_offset = this.a_tags[this.i_matching_tag].template_text_char_offset + this.a_tags[this.i_matching_tag].original_tag_label_length;
                    this.re_tag.lastIndex = this.a_tags[this.i_matching_tag].template_text_char_offset;

                    if(this.first_iteration_tag_index[this.a_tags[this.i_matching_tag].template_text_char_offset] != this.i) //successive iteration
                    {
                        this.a_tags[this.first_iteration_tag_index[this.a_tags[this.i_matching_tag].template_text_char_offset]].iterations--;
                        o_tag.iterations = this.a_tags[this.first_iteration_tag_index[this.a_tags[this.i_matching_tag].template_text_char_offset]].iterations;
                        this.o_json_parent = this.prev_o_json_parent;
                    }
                }
                else
                {
                    this.a_tags[this.first_iteration_tag_index[this.a_tags[this.i_matching_tag].template_text_char_offset]].current_iteration = -1;
                    this.i_json_parent = this.a_tags[this.i_matching_tag].i_json_parent;
                    this.o_json_parent = this.a_tags[this.i_matching_tag].o_json_parent;
                    this.i_template_parent = this.a_tags[this.i_matching_tag].i_template_parent;
                    this.i_matching_tag = this.a_tags[this.i_matching_tag].i_template_parent;
                }
            }
            else 
            {
                this.i_json_parent = this.a_tags[this.i_matching_tag].i_json_parent;
                this.o_json_parent = this.a_tags[this.i_matching_tag].o_json_parent;
                this.i_template_parent = this.a_tags[this.i_matching_tag].i_template_parent;
                this.i_matching_tag = this.a_tags[this.i_matching_tag].i_template_parent;
            }
        }
        
        prototype_name = Object.prototype.toString.call(object_reference);
        if((prototype_name != "[object Array]") && (prototype_name != "[object Object]") && (o_tag.i_type != t_boolean))
        {
            close_primitive = true;
            lastIndex = this.re_tag.lastIndex;
            match_next_tag = this.re_tag.exec(this.s_template);
            
            if(match_next_tag) offset2 = this.re_tag.lastIndex - match_next_tag[0].length;
            else offset2 = this.s_template.length - 1;
            
            this.re_tag.lastIndex = lastIndex;

            if(offset2 > this.highest_printed_plaintext_offset)
            {
                s_plaintext = this.s_template.substring(o_tag.template_text_char_offset + o_tag.original_tag_label_length, offset2);
                
                if(this.render_disable == -1) this.s_html += s_plaintext;

                if(match_next_tag) this.highest_printed_plaintext_offset = offset2 + match_next_tag[0].length;
                else this.highest_printed_plaintext_offset = this.s_template.length;
            }

            if(o_tag.is_subset)
            {
                if(o_tag.iterations > 0)
                {
                    this.highest_printed_plaintext_offset = o_tag.plaintext_offset;
                    this.re_tag.lastIndex = o_tag.template_text_char_offset;

                    if(this.first_iteration_tag_index[o_tag.template_text_char_offset] != this.i) //successive iteration
                    {
                        this.a_tags[this.first_iteration_tag_index[o_tag.template_text_char_offset]].iterations--;
                        o_tag.iterations = this.a_tags[this.first_iteration_tag_index[o_tag.template_text_char_offset]].iterations;
                    }
                }
                else
                {
                    if(this.a_tags[this.first_iteration_tag_index[o_tag.template_text_char_offset]] == undefined) this.first_iteration_tag_index[o_tag.template_text_char_offset] = this.i;
                    else this.a_tags[this.first_iteration_tag_index[o_tag.template_text_char_offset]].current_iteration = -1;
                    
                    o_tag.current_iteration = -1;
                    this.i_matching_tag = o_tag.i_template_parent;
                }
            }
            else this.i_matching_tag = o_tag.i_template_parent;

            this.a_tags.push(o_tag);
        }

        if(!close_primitive) this.a_tags.push(o_tag);

        this.i++;
        return true;
    }
    
    return false;
};

sjtl_engine.prototype.run_sjtl = function(s_json)
{
    this.s_template = document.getElementById(this.s_template_divtag_id).innerHTML.replace(/^\s+|\s+$/g, "");
    this.s_template = this.s_template.substring(4, this.s_template.length - 3);

    this.o_json_parent = JSON.parse(s_json);
    
    var retval = false;
    var iteration = 0;
    var MAX_ITERATIONS = 10000;

    try 
    {
        do
        {
            iteration++;
            retval = this.process_tag();
        }
        while(retval && (iteration < MAX_ITERATIONS))
    }
    catch(err)
    {
        document.getElementById(this.s_render_divtag_id).innerHTML = "";
    }
    finally
    {
        document.getElementById(this.s_render_divtag_id).innerHTML = this.s_html;
    }
};
