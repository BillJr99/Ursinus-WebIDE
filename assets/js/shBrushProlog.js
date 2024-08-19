/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/wiki/SyntaxHighlighter:Donate
 *
 * @version
 * 2.0.320 (May 03 2009)
 * 
 * @copyright
 * Copyright (C) 2004-2009 Alex Gorbatchev.
 *
 * @license
 * This file is part of SyntaxHighlighter.
 * 
 * SyntaxHighlighter is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * SyntaxHighlighter is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with SyntaxHighlighter.  If not, see <http://www.gnu.org/copyleft/lesser.html>.
 *
 *
 * This custom brush was made by <rotter dot manuel at gmail dot com>.
 *
 */
;(function()
{
    // CommonJS
    typeof(require) != 'undefined' ? SyntaxHighlighter = require('shCore').SyntaxHighlighter : null;

    function Brush()
    {
         var predicates     =     'abolish abort absolute_file_name access_file acyclic_term add_import_module add_nb_set append apply apropos arg assert asserta assertion assertz assoc_to_list at_end_of_stream at_halt atom atom_chars atom_codes atom_concat atom_length atom_number atom_prefix atom_to_term atomic atomic_concat atomic_list_concat attach_console attr_portray_hook attr_unify_hook attribute_goals attvar autoload autoload_path b_getval b_setval bagof between blob break byte_count call call_cleanup call_residue_vars call_shared_object_function call_with_depth_limit callable catch char_code char_conversion char_type character_count chdir chr_constraint chr_leash chr_notrace chr_option chr_show_store chr_trace chr_type clause clause_property close close_dde_conversation close_shared_object code_type collation_key comment_hook compare compile_aux_clauses compile_predicates compiling compound consult context_module convert_time copy_predicate_clauses copy_stream_data copy_term copy_term_nat create_prolog_flag current_arithmetic_function current_atom current_blob current_char_conversion current_flag current_foreign_library current_format_predicate current_functor current_input current_key current_module current_op current_output current_predicate current_prolog_flag current_signal current_stream cyclic_term date_time_stamp date_time_value day_of_the_week dcg_translate_rule dde_current_connection dde_current_service dde_execute dde_poke dde_register_service dde_request dde_unregister_service debug debug_control_hook debugging default_module del_attr del_attrs delete_directory delete_file delete_import_module deterministic dif directory_files discontiguous downcase_atom duplicate_term dwim_match dwim_predicate dynamic edit elif else empty_assoc empty_nb_set encoding endif ensure_loaded erase eval_license exception exists_directory exists_file exists_source expand_answer expand_file_name expand_file_search_path expand_goal expand_query expand_term expects_dialect explain export fail false file_base_name file_directory_name file_name_extension file_search_path find_chr_constraint findall flag float flush_output forall format format_predicate format_time freeze frozen functor garbage_collect garbage_collect_atoms garbage_collect_clauses gdebug gen_assoc gen_nb_set gensym get get0 get_assoc get_attr get_attrs get_byte get_char get_code get_single_char get_time getenv goal_expansion ground gspy gtrace guitracer gxref halt help help_hook if ignore import import_module in_pce_thread in_pce_thread_sync include initialization instance integer interactor is is_absolute_file_name is_list is_stream join_threads keysort last leash length library_directory license line_count line_position list_debug_topics list_to_assoc list_to_set listing load_files load_foreign_library locale_sort make make_directory make_library_index map_assoc max_assoc memberchk message_hook message_line_element message_queue_create message_queue_destroy message_queue_property message_to_string meta_predicate min_assoc module module_property module_transparent msort multifile mutex_create mutex_destroy mutex_lock mutex_property mutex_statistics mutex_trylock mutex_unlock mutex_unlock_all name nb_current nb_delete nb_getval nb_linkarg nb_linkval nb_set_to_list nb_setarg nb_setval nl nodebug noguitracer nonvar noprofile noprotocol normalize_space nospy nospyall not notrace nth_clause number number_chars number_codes numbervars on_signal once op open open_dde_conversation open_null_stream open_resource open_shared_object ord_list_to_assoc parse_time pce_call pce_dispatch peek_byte peek_char peek_code phrase please plus portray portray_clause predicate_property predsort preprocessor print print_message print_message_lines profile profile_count profiler prolog prolog_choice_attribute prolog_current_frame prolog_edit:edit_command prolog_edit:edit_source prolog_edit:load prolog_edit:locate prolog_exception_hook prolog_file_type prolog_frame_attribute prolog_ide prolog_list_goal prolog_load_context prolog_load_file prolog_skip_frame prolog_skip_level prolog_stack_property prolog_to_os_filename prolog_trace_interception prompt prompt1 protocol protocola protocolling public put put_assoc put_attr put_attrs put_byte put_char put_code qcompile qsave_program random_property rational read read_clause read_history read_link read_pending_input read_term recorda recorded recordz redefine_system_predicate reexport reload_foreign_libraries reload_library_index rename_file repeat require reset_gensym reset_profiler resource retract retractall rl_add_history rl_read_history rl_read_init_file rl_write_history same_file same_term see seeing seek seen set_end_of_stream set_input set_module set_output set_prolog_IO set_prolog_flag set_prolog_stack set_random set_stream set_stream_position set_tty setarg setenv setlocale setof setup_call_catcher_cleanup setup_call_cleanup shell show_profile size_file size_nb_set skip sleep sort source_exports source_file source_file_property source_location spy stamp_date_time statistics stream_pair stream_position_data stream_property string string_concat string_length string_to_atom string_to_list strip_module style_check sub_atom sub_string subsumes_term succ swritef tab tdebug tell telling term_attvars term_expansion term_hash term_subsumer term_to_atom term_variables thread_at_exit thread_create thread_detach thread_exit thread_get_message thread_initialization thread_join thread_local thread_peek_message thread_property thread_self thread_send_message thread_setconcurrency thread_signal thread_statistics threads throw time time_file tmp_file tmp_file_stream tnodebug told tprofile trace tracing trim_stacks true tspy tty_get_capability tty_goto tty_put tty_size ttyflush unifiable unify_with_occurs_check unix unknown unload_file unload_foreign_library unsetenv upcase_atom use_foreign_library use_module var var_number variant_sha1 visible volatile wait_for_input when wildcard_match win_exec win_folder win_has_menu win_insert_menu win_insert_menu_item win_registry_get_value win_shell win_shell win_window_pos window_title with_mutex with_output_to working_directory write write_canonical write_length write_term writef writeln writeq';

         var lib_predicates =     'add_edges add_vertices aggregate aggregate_all all_different all_distinct append assert_predicate_options assertion assertion_failed assignment assoc_to_keys assoc_to_list assoc_to_values atom_to_chars automaton bb_inf broadcast broadcast_request chain check check_predicate_option check_predicate_options circuit complement compose constraint constraint_add csv csv_read_file csv_read_file_row csv_write_file csv_write_stream cumulative current_option_arg current_predicate_option current_predicate_options current_thread_pool debug debug_message_context debug_print_hook debugging del_edges del_vertices delete derive_predicate_options derived_predicate_options dump edges element empty_assoc entailed exclude fd_dom fd_inf fd_size fd_sup fd_var file_name_to_url flatten foreach format_to_chars free_variables gen_assoc gen_state get_assoc getrand global_cardinality global_url group_pairs_by_key http_location in include indomain inf ins intersection is_absolute_url is_ordset is_set label labeling last lex_chain list_autoload list_debug_topics list_redefined list_to_assoc list_to_ord_set list_to_set list_undefined listen listening map_assoc map_list_to_pairs maplist max_assoc max_list max_member max_var_number maximize maybe member merge_options meta_options min_assoc min_list min_member minimize neighbors neighbours nextto nodebug nth0 nth1 number_to_chars numbervars numlist objective open_chars_stream opt_arguments opt_help opt_parse option ord_add_element ord_del_element ord_disjoint ord_empty ord_intersect ord_intersection ord_list_to_assoc ord_member ord_memberchk ord_seteq ord_subset ord_subtract ord_symdiff ord_union pairs_keys pairs_keys_values pairs_values parse_url parse_url_search partition permutation phrase_from_file predicate_options prefix prolog:called_by proper_length put_assoc random random_between random_member random_perm2 random_permutation random_select randseq randset reachable read_file_to_codes read_file_to_terms read_from_chars read_line_to_codes read_stream_to_codes read_term_from_chars record registry_delete_key registry_get_key registry_set_key retractall_predicate_options reverse same_length scalar_product select select_option selectchk serialized set_url_encoding setrand shadow_price shell_register_dde shell_register_file_type shell_register_prolog stream_to_lazy_list subset subtract sum sumlist sup thread_create_in_pool thread_pool_create thread_pool_destroy thread_pool_property top_sort transitive_closure transportation transpose transpose_pairs tuples_in ugraph_union union unlisten url_iri variable_value varnumbers vertices vertices_edges_to_ugraph with_output_to_chars write_to_chars www_form_encode www_open_url xref_built_in xref_called xref_clean xref_current_source xref_defined xref_exported xref_module xref_source zcompare';

         var arithmetic     =     'abs acos asin atan atan2 ceil ceiling cos cputime div epsilon eval exp float float_fractional_part float_integer_part floor gcd integer log log10 lsb max min mod msb pi popcount powm random random_float rational rationalize rdiv rem round sign sin sqrt tan truncate xor'; // add 'e'
         // var operators      =     '';    LEAVE OUT?
         
         //keywords = arithmetic + ' ' + lib_predicates + ' ' + predicates;


         this.regexList = [
              { regex: new RegExp(this.getKeywords(predicates), 'gmi'),        css: 'keyword' },              // built-in predicates 
              { regex: new RegExp(this.getKeywords(lib_predicates), 'gmi'),    css: 'color1' },               // library predicates 
              { regex: new RegExp(this.getKeywords(arithmetic), 'gmi'),        css: 'functions' },            // arithmetic functions
              { regex: /[A-Z]+[a-zA-Z0-9]*/g,                                  css: 'variable' },             // variables
              { regex: SyntaxHighlighter.regexLib.singleQuotedString,          css: 'string' },               // single quoted strings
              { regex: SyntaxHighlighter.regexLib.doubleQuotedString,          css: 'string' },               // double quoted strings
              { regex: SyntaxHighlighter.regexLib.multiLineCComments,          css: 'comments' },             // multiline comments
              { regex: /%.*$/gm,                                               css: 'comments' },             // one line comments
              ];
    }
    
    Brush.prototype = new SyntaxHighlighter.Highlighter();
    Brush.aliases = ['prolog', 'swipl'];

    SyntaxHighlighter.brushes.Prolog = Brush;

    // CommonJS
    typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();